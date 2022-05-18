import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, getEmotion, getExactDayNow, time, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';
import { LikeModel } from '../../../models/core/like';
import { RecordModel } from '../../../models/record/Record';
import { RECORD_TYPE, ROLES } from '../../../Constants';

export default (router: Router) => {
    router.post("/like",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            const  {emotion_id, id} = req.body;

            try {
                const blog = await BlogModel.findByPk(id);
                if(!blog){
                    return res.status(200).send(new BaseError("Blog not found!", BaseError.Code.ERROR).release());
                }

                const emotion = getEmotion(emotion_id);
                if(!emotion){
                    return res.status(200).send(new BaseError("Emotion invalid!", BaseError.Code.ERROR).release());
                }

                let like = await LikeModel.findOne({
                    where:{
                        hash_key: LikeModel.createHashKey(blog.id, user.id)
                    }
                }) 
                if(!like){
                    like = await LikeModel.saveObject({
                        user_id :user.id,
                        since :time(),
                        emotion_id :emotion_id,
                        blog_id :blog.id,
                        hash_key :LikeModel.createHashKey(blog.id, user.id)
                    })
                }else{
                    like.emotion_id = emotion_id;
                    like.since =time();
                    await like.edit(["emotion_id","since"]);
                }

                blog.like_number += 1;
                await blog.edit(["like_number"]);
                const owner = await UserModel.findByPk(blog.user_id);

                if(owner.is(ROLES.DEVELOPER)){
                    const day = getExactDayNow();
                    await user.updateRecord({
                        type: RECORD_TYPE.LIKE,
                        day: day,
                        value: 1
                    })
                }

                await blog.onLike(like,user, [owner])
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