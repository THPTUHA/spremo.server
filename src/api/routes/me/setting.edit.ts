import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { SettingModel } from '../../../models/core/setting';

export default (router: Router) => {
    router.post("/setting.edit",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const {setting_id,action, type,data, emotion_id} = req.body;

                const setting = await SettingModel.findByPk(setting_id);
                if(!setting){
                    return res.status(200).send(new BaseError("Setting not found!", BaseError.Code.ERROR).release());
                }

                const setting_exit = await SettingModel.findOne({
                    where:{
                        emotion_id: emotion_id,
                        action: action
                    }
                })

                if(setting_exit){
                    return res.status(200).send(new BaseError("Setting existed!", BaseError.Code.ERROR).release());
                }

                setting.action = action;
                setting.type = type;
                setting.data = data;
                setting.emotion_id = emotion_id;
                
                await setting.save();

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