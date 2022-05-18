import { Router } from 'express';
import { UserModel } from '../../../models/user/user';
import BaseError from '../../../packages/base.error/BaseError';
import Crypto from '../../../packages/crypto/crypto';
import Valid from '../../../packages/valid/valid';
import { time } from '../../../services/helper';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import Mailer from '../../../packages/mailer/Mailer';
import { AVATARS, ROLES } from '../../../Constants';

export default (router: Router) => {
    router.post("/signup", multer({}).fields([]),async(req, res)=>{
        try {
            const {
                username,
                email,
                password,
                confirm_password,
                is_developer,
                is_agree
            } = req.body;

            if (!username) {
                return res.status(200).json(new BaseError('Username cannot be empty', -1).release());
            }
            
            if (!email) {
                return res.status(200).json(new BaseError('Email cannot be empty', -1).release());
            }
            
            if(is_developer ){
                if(!is_agree){
                    return res.status(200).json(new BaseError('You must agree terms!', -1).release());
                }
            }

            var exist_username = await UserModel.findOne({
                where: { username: username }
            });

            if (exist_username) {
                return res.status(200).json(new BaseError('Username existed', -1).release());
            }
    
            var exist_email = await UserModel.findOne({
                where: { email: email }
            });
            if (exist_email) {
                return res.status(200).json(new BaseError('Email existed', -1).release());
            }
    
            if (!Valid.email(email)) {
                return res.status(200).json(new BaseError('Email is invalid', -1).release());
            }
    
            if (!password) {
                return res.status(200).json(new BaseError('Email cannot be empty', -1).release());
            }
    
            if (!confirm_password || (confirm_password != password)) {
                return res.status(200).json(new BaseError('Confirm password is not matched', -1).release());
            }
    
            if (!Valid.isUserName(username)) {
                return res.status(200).json(new BaseError('Username is invalid', -1).release());   
            }
    
            var hash_password = Crypto.hashUsernamePassword(username, password);
    
            var new_user = {
                email: email,
                username: username,
                fullname: username,
                password: hash_password,
                since: time(),
                avatar: AVATARS[Math.floor(Math.random()*AVATARS.length)],
                last_update: time(),
                role: is_developer? ROLES.DEVELOPER: ROLES.USER,
                active_status: -1,
                follower_number: 0,
                friends: JSON.stringify([]),
                following: JSON.stringify([])
            };
    
            const user = await UserModel.saveObject(new_user);
    
            if (!user) {
                return res.status(200).json(new BaseError('DB Errors', -1).release());
            }
    
            const token = jwt.sign({
                password: user.password,
                username: user.username,
                email: user.email
            }, process.env.JWT_VERIFY_USER_KEY);
    
            
            let content = await Mailer.getMailContent("activate_account.html", {
                mail_receiver: user.email,
                link_activate: `${process.env.CLIENT_URL}/authentication/verify?token=${token}`
            })
    
            const message = await Mailer.sendMail(
                [user.email],
                content,
                'Verify Account'
            );
            if(!message){
                return res.status(200).send(new BaseError("Email error!", BaseError.Code.ERROR).release());
            }

            return res.status(200).json(new BaseError("Register successful", BaseError.Code.SUCCESS));
        } catch (error) {
            console.log("ERROR",error);
            return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
        }
    })
};