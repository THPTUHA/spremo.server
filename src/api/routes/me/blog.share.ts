import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, isValidShareOption, time, updateManyTag, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';
import { TagModal } from '../../../models/tag/tag';
import { MapTagModal } from '../../../models/map.tag/map.tag';
import { BAN, FRIEND_SPECIFIC, PUBLIC } from '../../../Constants';

export default (router: Router) => {
    router.post("/blog.share",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            let {id , share_option_id, friend_ids} = req.body;
            try {
                id = castToNumber(id);

                if(!id){
                    return res.status(200).send(new BaseError("Id invalid!", BaseError.Code.ERROR).release());
                }

                if(!user.isHasBlog(id)){
                    return res.status(200).send(new BaseError("You don't have right!", BaseError.Code.ERROR).release());
                }
                const status = castToNumber(share_option_id);
                if(!isValidShareOption(status)){
                    return res.status(200).send(new BaseError("Share invalid!", BaseError.Code.ERROR).release());
                }

                const blog = await BlogModel.findByPk(id);

                if(!blog){
                    return res.status(200).send(new BaseError("Blog is not exist!", BaseError.Code.ERROR).release());
                }

                if(blog.status == BAN){
                    return res.status(200).send(new BaseError("You can't share blog!", BaseError.Code.ERROR).release());
                }

                const emotion_name = blog.hash_key.split("#")[0];
                
                blog.user_views = status == FRIEND_SPECIFIC ? friend_ids: blog.user_views;
                blog.status = status;
                blog.hash_key = blog.editHashKeySync({id: -1 ,name: emotion_name});

                await blog.edit(["status","hash_key","user_views"]);
                await user.editBlog(blog.id, blog.status);

                const tags = blog.getTags();
                tags.push(emotion_name);

                await updateManyTag({
                    tags: Array.from(new Set(tags)) as string[],
                    user_id: user.id,
                    blog: blog
                })
                return res.status(200).send({
                    blog: blog.release(),
                    code: BaseError.Code.SUCCESS
                });

            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Emotional Damage!!", BaseError.Code.ERROR).release());
            }
        })
    )
};