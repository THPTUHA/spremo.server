import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { SettingModel } from '../../../models/core/setting';
import user from '../user';
import { UserModel } from '../../../models/user/user';

export default (router: Router) => {
    router.post("/setting.delete",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const {setting_id} = req.body;

                const setting = await SettingModel.findByPk(setting_id);

                const user = req.user as UserModel;
                if(!setting || setting.user_id != user.id){
                    return res.status(200).send(new BaseError("Setting not found!", BaseError.Code.ERROR).release());
                }

                await setting.destroy();
                
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