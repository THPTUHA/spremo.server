import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { ROLES } from '../../../Constants';

export default (router: Router) => {
    router.post("/censor",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const {id} = req.body;
                const user = req.user as UserModel;
                if(!user.is(ROLES.ADMIN)){
                    return res.status(200).send(new BaseError("You have no right!", BaseError.Code.ERROR).release());
                }
                const user_update = await UserModel.findByPk(id);

                if(!user_update){
                    return res.status(200).send(new BaseError("You not found!", BaseError.Code.ERROR).release());
                }

                user_update.role = ROLES.CENSOR;
                await user_update.edit(["role"]);

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