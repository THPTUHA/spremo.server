import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { wrapAsync } from '../../../services/helper';

export default (router: Router) => {
    router.post("/signin", multer({}).fields([]),
        wrapAsync(async(req, res)=>{
            try {
                const { keep_login } = req.body;
                passport.authenticate('signin', (error, user, arg) => {
                    var code = parseInt(arg.message);
    
                    if(code != BaseError.Code.SUCCESS){
                        var message = "";
                        if(code == BaseError.Code.INACTIVATE_AUTH){
                            message = "Your email is not verified!"
                        }
                        else if(code == BaseError.Code.INVALID_AUTH || code == BaseError.Code.INVALID_PASSWORD){
                            message = "Username or password is not correct!"
                        }
                        else{
                            message = "Some error occurred!";
                        }
    
                        return res.status(200).json(new BaseError(message, code).release());
                    }
    
                    if (user) {
                        req.login(user, { session: false }, async (error) => {
                            const body = { id: user.id, name: user.name, email: user.email, username: user.username };
                            let config: jwt.SignOptions = {};
                            if (keep_login) {
                                config.expiresIn = '24h';
                            }
                            const access_token = jwt.sign({ user: body }, process.env.JWT_ENCODE_USER_KEY, config);
                            return res.status(200).json({ access_token, id: user.id, code});
                        })
                    } else {
                        return res.status(200).json(new BaseError("Some error occurred!", BaseError.Code.ERROR).release());
                    }
                })(req, res);
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};