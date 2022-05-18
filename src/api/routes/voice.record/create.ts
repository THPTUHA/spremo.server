import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import cloudinary_handle from '../../../packages/cloudinary/cloudinary';
import { getEmotion, time, wrapAsync } from '../../../services/helper';
import fs from 'fs';
import { BLOG_TYPES, PRIVATE } from '../../../Constants';
import { BlogModel } from '../../../models/blog/blog';
import { UserModel } from '../../../models/user/user';

export default (router: Router) => {
    router.post("/create",  
            multer({}).fields([]),
            passport.authenticate('jwt', { session: false }),
            wrapAsync(
                async(req, res)=>{
                    let {status,emotion_id,audio, title} = req.body; 
                    const user = req.user as UserModel;
                    if(!user){
                        return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
                    }
                    try {
                        if(!status){
                            status = PRIVATE;
                        }
                        
                        emotion_id = getEmotion(emotion_id);
                        console.log("STATUS", status,emotion_id); 

                        if(status != PRIVATE && !emotion_id){
                            return res.status(200).send(new BaseError("Blog must have emotion tag!", BaseError.Code.ERROR).release());
                        }

                        if(status == PRIVATE){
                            emotion_id  = emotion_id? emotion_id : 0
                        }

                        if (!audio) {
                            return res.status(200).send(new BaseError("Audio can not be empty!", -1).release());
                        }

                        if(!status) status = PRIVATE;
                        
                        const blog = await BlogModel.saveObject({
                            user_id: user.id,
                            data: JSON.stringify({
                                title: title,
                                url: audio
                            }),
                            type: BLOG_TYPES.AUDIO,
                            last_update: time(),
                            created_time: time(),
                            status: status
                        })
                        
                        await blog.editHashKey(emotion_id);
                        await user.addBlog(blog.id, status);
                        
                        return res.status(200).send(new BaseError("Audio save successfull!", BaseError.Code.SUCCESS).release());

                    } catch (error) {
                        console.log("ERROR",error);
                        return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
                    }
                }
            )
        )
};