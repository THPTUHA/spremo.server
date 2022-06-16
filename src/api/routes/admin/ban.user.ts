import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { ROLES } from '../../../Constants';

export default (router: Router) => {
    router.post("/ban.user",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const user = req.user as UserModel;
                const {id} = req.body;
                if(!user || !user.is(ROLES.ADMIN)){
                    return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
                }

                const user_ban = await UserModel.findByPk(id);
                user_ban.active_status = user_ban.active_status == UserModel.BANNED ? UserModel.ACTIVED: UserModel.BANNED;
                user_ban.edit(["active_status"]);

                return res.status(200).send({
                    user: user_ban.release(),
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};