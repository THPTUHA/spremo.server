import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';

export default (router: Router) => {
    router.post("/blog.get",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            let {id} = req.body;
            try {
                id = castToNumber(id);

                if(!id){
                    return res.status(200).send(new BaseError("Id invalid!", BaseError.Code.ERROR).release());
                }

                if(!user.isHasBlog(id)){
                    return res.status(200).send(new BaseError("You don't have right!", BaseError.Code.ERROR).release());
                }

                const blog = await BlogModel.findByPk(id);

                if(!blog){
                    return res.status(200).send(new BaseError("Blog is not exist!", BaseError.Code.ERROR).release());
                }

                return res.status(200).send({
                    blog: blog.release(),
                    code: BaseError.Code.SUCCESS
                });

            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Emotional Damage!!", BaseError.Code.ERROR).release());
            }
        })
    )
};