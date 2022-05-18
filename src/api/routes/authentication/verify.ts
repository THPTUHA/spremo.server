import { Router } from 'express';
import { UserModel } from "../../../models/user/user";
import BaseError from "../../../packages/base.error/BaseError";
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { ROLES } from '../../../Constants';

export default (router: Router) =>{
    router.post('/verify',multer({}).fields([]), async (req, res) => {
        const { token } = req.body;
        console.log("TOKEN",token);
        let user_jwt: any = null;
        try {
            try {
                user_jwt = jwt.verify(token, process.env.JWT_VERIFY_USER_KEY);
            } catch (e) {
                if (e.message == 'jwt expired') {
                    return res.status(200).json(new BaseError('Token is expired', BaseError.Code.ERROR).release());
                }
            }
        
            if (!user_jwt || typeof user_jwt == 'string') {
                return res.status(200).json(new BaseError('Token is invalid', BaseError.Code.ERROR).release());
            }
            const user = await UserModel.findOne({
                where: {
                    username: user_jwt.username,
                    email: user_jwt.email
                }
            });
        
            if (!user) {
                return res.status(200).json(new BaseError('User is invalid', BaseError.Code.ERROR).release());
            } else {
                user.active_status = UserModel.ACTIVED;
                await user.save();
            }
        
            return res.status(200).send({
                code:  BaseError.Code.SUCCESS,
                user: user.release(),
            });    

        } catch (error) {
            console.log("ERROR",error);
            return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
        }
    })
}