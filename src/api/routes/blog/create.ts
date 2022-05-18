import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { getEmotion, time, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';
import { BLOG_TYPES, PRIVATE } from '../../../Constants';

export default (router: Router) => {
    router.post("/create",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            let {data, status, emotion_id} = req.body; 

            if(!data){
                return res.status(200).send(new BaseError("Blog must have content!", BaseError.Code.ERROR).release());
            }

            if(!status){
                status = PRIVATE;
            }

            emotion_id = getEmotion(emotion_id); 
            if(status != PRIVATE && !emotion_id){
                return res.status(200).send(new BaseError("Blog must have emotion tag!", BaseError.Code.ERROR).release());
            }

            if(status == PRIVATE){
                emotion_id  = emotion_id? emotion_id : 0
            }

            try {
                const blog = await BlogModel.saveObject({
                    user: user.id,
                    data: data,
                    type: BLOG_TYPES.COMBINE,
                    last_update: time(),
                    created_time: time(),
                    status: status,
                    like_number: 0
                });

                await blog.editHashKey(emotion_id);
                await user.addBlog(blog.id, status);
                
                return res.status(200).send(new BaseError("Blog save successfull!", BaseError.Code.SUCCESS).release());
                
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};