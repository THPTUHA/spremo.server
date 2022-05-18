import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { uploadFile, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';

export default (router: Router) => {
    router.post("/appearance.edit",  
        multer({}).fields([{ name: 'avatar' },{ name: 'background' }]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const user = req.user as UserModel;
                if(!user){
                    return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
                }

                if (!req.files || !req.files['avatar'] || req.files['avatar'].length == 0) {
                    user.avatar = user.avatar;
                }else{
                    user.avatar = (await uploadFile(req.files['avatar'][0])).url;
                }

                if (!req.files || !req.files['background'] || req.files['background'].length == 0) {
                    user.background = user.background;
                }else{
                    user.background = (await uploadFile(req.files['background'][0])).url;
                }

                console.log("AVater",user.avatar);
                console.log("Background",user.background);
                
                await user.edit(["avatar","background"]);

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