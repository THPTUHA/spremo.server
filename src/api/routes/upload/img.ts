import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import cloudinary_handle from '../../../packages/cloudinary/cloudinary';
import fs from 'fs';

export default (router: Router) => {
    router.post("/img",  
    multer({}).fields([{ name: 'image' }]),
    passport.authenticate('jwt', { session: false }),
    wrapAsync(async(req, res)=>{
        const user = req.user as UserModel;
        if(!user){
            return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
        }
        try {
            const {name} = req.body;

            if (!req.files || !req.files['image'] || req.files['image'].length == 0) {
                return res.status(200).send(new BaseError("Image can not be empty!", -1).release());
            }

            var image = req.files['image'][0];
            let uploadLocation = __dirname + image.originalname;
            fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(image.buffer)) );
            const config :any= {
                upload_preset: 'emotion',
            }
            
            if(name){
                config.public_id = name
            }
            const uploadResponse = await cloudinary_handle.uploader.upload(uploadLocation, config);

            fs.unlink(uploadLocation, (deleteErr) => {
                console.log('temp file was deleted');
            });

            console.log("Upload",uploadResponse);
            res.status(200).send({
                url: uploadResponse.url,
                code: BaseError.Code.SUCCESS
            });

        } catch (error) {
            console.log("ERROR",error);
            return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
        }
    })
)
};