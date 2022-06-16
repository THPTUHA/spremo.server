import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { BlogModel } from '../../../models/blog/blog';
import { BAN, PRIVATE, PUBLIC, ROLES } from '../../../Constants';
import { castToNumber, getEmotion, isValidBlogType, isValidStatus, time, updateManyTag, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';

export default (router: Router) => {
    router.post("/ban.blog",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const {id, reason} = req.body
            try {
                const user = req.user as UserModel;

                if(!user || (!user.is(ROLES.ADMIN) && !user.is(ROLES.CENSOR))){
                    return res.status(200).send(new BaseError("You have no right!", BaseError.Code.ERROR).release());
                }

                const blog = await BlogModel.findByPk(id);
                if(!blog){
                    return res.status(200).send(new BaseError("Blog not found!", BaseError.Code.ERROR).release());
                }

                if(blog.status == PRIVATE){
                    return res.status(200).send(new BaseError("Blog is private!", BaseError.Code.ERROR).release());
                }

                blog.status = blog.status == BAN ? PUBLIC : BAN;
                await blog.edit(["status"]);
                
                const emotion_name = blog.hash_key.split("#")[0] ;
                if(emotion_name){
                    await blog.editHashKey();
                }

                let list_tag = blog.getTags();
                list_tag.push(emotion_name);
                list_tag = Array.from(new Set(list_tag)) as string[];

                await updateManyTag({
                    tags: list_tag,
                    user_id: user.id,
                    blog: blog
                })

                if(blog.status == BAN){
                    const owner = await UserModel.findByPk(blog.user_id);
                    blog.onBan(blog, user,owner,reason);
                }

                return res.status(200).send({
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};