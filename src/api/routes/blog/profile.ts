import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import { castToNumber, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';

export default (router: Router) => {
    router.post("/profile",  
        multer({}).fields([]),
        wrapAsync(async(req, res)=>{
            try {
                const {username} = req.body;
                const user = await UserModel.findOne({
                    where: {username: username}
                })

                if(!user){
                    return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
                }
                                
                return res.status(200).send({
                    is_follow: false,
                    is_friend: false,
                    user: user.release(),
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};