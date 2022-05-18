import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { time, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { ROLES, TIME_EMOTION_STATUS_RESET } from '../../../Constants';

export default (router: Router) => {
    router.post("/get",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user  as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            try {
                if(user.is(ROLES.DEVELOPER)){
                    return res.status(200).send({
                        emotion_id: user.emotion_id ? user.emotion_id : 0,
                        is_change: false,
                        code: BaseError.Code.SUCCESS
                    });
                }

                const is_change = (time() - user.emotion_last_update > TIME_EMOTION_STATUS_RESET)|| !user.emotion_id;

                return res.status(200).send({
                    emotion_id: user.emotion_id ? user.emotion_id : 0,
                    is_change: is_change,
                    code: BaseError.Code.SUCCESS
                });

            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};