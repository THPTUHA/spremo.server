import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { getEmotion, getSetting, wrapAsync } from '../../../services/helper';
import { SettingModel } from '../../../models/core/setting';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';

export default (router: Router) => {
    router.post("/setting.save",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {

                const {action, type,data, emotion_id} = req.body;   
                const user = req.user as UserModel;

                const emotion = getEmotion(emotion_id);
                if(!emotion.id){
                    return res.status(200).send(new BaseError("Emotion empty!", BaseError.Code.ERROR).release());
                }

                const setting = getSetting(action);
                if(!setting || !setting.type.includes(type)){
                    return res.status(200).send(new BaseError("Setting invalid!", BaseError.Code.ERROR).release());
                }

                const setting_exit = await SettingModel.findOne({
                    where:{
                        emotion_id: emotion_id,
                        action: action,
                        user_id: user.id
                    }
                })

                if(setting_exit){
                    return res.status(200).send(new BaseError("Setting existed!", BaseError.Code.ERROR).release());
                }

                const setting_saved = await SettingModel.saveObject({
                    action: action,
                    type: type,
                    emotion_id: emotion_id,
                    user_id: user.id,
                    data: data
                })

                
                setting_saved.blogs = await BlogModel.findAll({
                    where: {
                        id:  JSON.parse(setting_saved.data).blog_ids
                    }   
                })

                return res.status(200).send({
                    setting: setting_saved.release(),
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};