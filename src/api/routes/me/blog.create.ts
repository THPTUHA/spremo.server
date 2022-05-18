import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, getEmotion, isValidBlogType, isValidStatus, time, updateOneTag, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';
import { BLOG_TYPES, DRAFT, DRAW_IMAGE, PRIVATE, ROLES } from '../../../Constants';
import { MapTagModal } from '../../../models/map.tag/map.tag';
import { TagModal } from '../../../models/tag/tag';

export default (router: Router) => {
    router.post("/blog.create",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            let {data, status, emotion_id, type, url, title,audio} = req.body; 

            try {

                status = castToNumber(status);
                if(!isValidStatus(status)){
                    if(user.is(ROLES.DEVELOPER)) status = DRAFT;
                    else status = PRIVATE;
                }
                
                const emotion = getEmotion(emotion_id); 
                if(status != PRIVATE && !emotion_id){
                    return res.status(200).send(new BaseError("Emotion tag empty!", BaseError.Code.ERROR).release());
                }
                
                type = castToNumber(type);
                if(!isValidBlogType(type)){
                    return res.status(200).send(new BaseError("Type invalid!", BaseError.Code.ERROR).release());
                }
                
                const object = {
                    user_id: user.id,
                    data: "",
                    type: type,
                    last_update: time(),
                    created_time: time(),
                    status: status,
                    like_number: 0
                }

                switch(type){
                    case BLOG_TYPES.COMBINE:
                        object.data = data;
                        break;
                    case BLOG_TYPES.DRAW:
                        object.data = JSON.stringify({
                            shapes: [{key: 0}],
                            url: DRAW_IMAGE
                        });
                        break;
                    case BLOG_TYPES.AUDIO:
                        if(!audio){
                            return res.status(200).send(new BaseError("", BaseError.Code.ERROR).release());
                        }
                        object.data  = JSON.stringify({
                            title: title,
                            url: audio
                        });
                        break;
                }

                if(!object.data){
                    return res.status(200).send(new BaseError("Blog must have content!", BaseError.Code.ERROR).release());
                }
                const blog = await BlogModel.saveObject(object);
                await blog.editHashKey(emotion);
                await user.addBlog(blog.id, status);
                
                await updateOneTag({
                    tag: emotion.name,
                    user_id: user.id,
                    blog: blog
                })

                return res.status(200).send({
                    blog: blog.release(),
                    code: BaseError.Code.SUCCESS
                });
                
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};