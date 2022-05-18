import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { getEmotion, time, wrapAsync ,castToNumber} from '../../../services/helper';
import { UserModel } from '../../../models/user/user';

export default (router: Router) => {
    router.post("/update",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user  as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            const {status} = req.body;
            try {
                const tag =  getEmotion(status);
                if(!tag){
                    return res.status(200).send(new BaseError("Emotion damage!", BaseError.Code.ERROR).release());
                }
                
                user.emotion_id = status;
                user.emotion_last_update = time();
                user.edit(["emotion_id","emotion_last_update"]);

                return res.status(200).send({
                    emotion_id: status,
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};