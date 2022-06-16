import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';
import { MapTagModal } from '../../../models/map.tag/map.tag';
import { BLOG_TYPES, PUBLIC } from '../../../Constants';
import { LikeModel } from '../../../models/core/like';
import { CommentModel } from '../../../models/comment/comment';

export default (router: Router) => {
    router.post("/blog.delete",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            let {id} = req.body;
            try {
                id = castToNumber(id);

                if(!id){
                    return res.status(200).send(new BaseError("Id invalid!", BaseError.Code.ERROR).release());
                }

                if(!user.isHasBlog(id)){
                    return res.status(200).send(new BaseError("You don't have right!", BaseError.Code.ERROR).release());
                }

                const blog = await BlogModel.findByPk(id);

                if(!blog){
                    return res.status(200).send(new BaseError("Blog is not exist!", BaseError.Code.ERROR).release());
                }
                const tags = blog.tags ? JSON.parse(blog.tags):[];
                if(tags.length){
                    await MapTagModal.destroy({
                        where:{
                            hash_key: tags.map(tag=> MapTagModal.setHashKey(tag, blog.status,user.id, blog.id))
                        }
                    })
                }
                await MapTagModal.destroy({
                    where:{
                        blog_id: blog.id
                    }
                })
                
                await LikeModel.destroy({
                    where:{
                        blog_id: blog.id
                    }
                })

                await CommentModel.destroy({
                    where:{
                        object_id: blog.id
                    }
                })

                if(blog.status == PUBLIC && (blog.type == BLOG_TYPES.COMBINE) || (blog.type == BLOG_TYPES.NOTE) ){
                    const user_data = user.data ? JSON.parse(user.data):{};
                    const image_user_data = user_data.images ? user_data.images.filter(item => item.blog_id != blog.id) : [];
                    
                    
                    user.data = JSON.stringify({
                        ...user_data,
                        images: image_user_data
                    })

                    await user.edit(["data"]);
                }

                await blog.destroy();
                return res.status(200).send({
                    code: BaseError.Code.SUCCESS
                });

            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Emotional Damage!!", BaseError.Code.ERROR).release());
            }
        })
    )
};