import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import cloudinary_handle from '../../../packages/cloudinary/cloudinary';
import fs from 'fs';

export default (router: Router) => {
    router.post("/audio",  
    multer({}).fields([{ name: 'audio' }]),
    passport.authenticate('jwt', { session: false }),
    wrapAsync(async(req, res)=>{
        const user = req.user as UserModel;
        if(!user){
            return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
        }
        try {

            if (!req.files || !req.files['audio'] || req.files['audio'].length == 0) {
                return res.status(200).send(new BaseError("Audio can not be empty!", -1).release());
            }

            var audio = req.files['audio'][0];
            let uploadLocation = __dirname + audio.originalname;
            fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(audio.buffer)) );

            const uploadResponse = await cloudinary_handle.uploader.upload(uploadLocation, {
                upload_preset: 'emotion',
                resource_type: 'video',
            });

            fs.unlink(uploadLocation, (deleteErr) => {
                console.log('Audio file was deleted');
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