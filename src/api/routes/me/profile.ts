import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { UserModel } from '../../../models/user/user';
import { time, wrapAsync } from '../../../services/helper';

export default (router: Router) => {
    router.post("/profile",multer({}).fields([]), passport.authenticate('jwt', { session: false }),
        wrapAsync( async(req, res)=>{
            try {
                if(req.user){
                    const user = req.user as UserModel;
                    user.last_login = time();
                    user.edit(["last_login"]);

                    res.status(200).send({
                        user: user.release(),
                        code: BaseError.Code.SUCCESS
                    });
                }
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};