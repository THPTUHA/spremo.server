import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';

export default (router: Router) => {
    router.post("/signout",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                if(req.user){
                    return res.status(200).send(new BaseError("Logout successed!", BaseError.Code.SUCCESS).release());
                }
                return res.status(200).send(new BaseError("Logout more!", BaseError.Code.ERROR).release());
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};