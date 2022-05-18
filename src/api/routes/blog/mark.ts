import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';
import { BLOG_TYPES } from '../../../Constants';

export default (router: Router) => {
    router.post("/mark",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            const {id} = req.body;
            try {
                if(id){
                    const user = req.user as UserModel;
                    if(!user){
                        return res.status(200).send(new BaseError("Please Login!", BaseError.Code.ERROR).release());
                    }
                    await user.editBlogSaved({blog_id: castToNumber(id)});
                    return res.status(200).send({
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