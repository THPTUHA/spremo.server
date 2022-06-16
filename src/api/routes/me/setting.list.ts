import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { SettingModel } from '../../../models/core/setting';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';
import { BLOG_TYPES, PUBLIC, SETTINGS } from '../../../Constants';
import { Sequelize } from 'sequelize-typescript';

export default (router: Router) => {
    router.post("/setting.list",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const user = req.user as UserModel;
                const {emotion_id} = req.body;

                let q:any = {
                    user_id: user.id,
                }

                if(emotion_id){
                    q = {
                        ...q,
                        emotion_id: emotion_id
                    }
                }

                const settings = await SettingModel.findAll({
                    where: q
                })


                for(const setting of settings){
                   if(setting.action == "listen_music"){
                       if(setting.type == "random"){
                            setting.blogs = await BlogModel.paginate({
                               where:{
                                   type: BLOG_TYPES.MUSIC,
                                   status: PUBLIC,
                               },
                               order: Sequelize.literal('rand()'),
                           },{page:1, page_size:1})
                       }else{
                            setting.blogs = await BlogModel.findAll({
                                where:{
                                    id: JSON.parse(setting.data).blog_ids
                                }
                            })
                       }
                   }
                }

                return res.status(200).send({
                    settings: settings.map(e => e.release()),
                    code: BaseError.Code.SUCCESS
                });

            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};