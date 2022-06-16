import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { BlogModel } from '../../../models/blog/blog';
import { UserModel } from '../../../models/user/user';
import { BAN } from '../../../Constants';
import { NotificationModel } from '../../../models/core/notification';

export default (router: Router) => {
    router.post("/blog.detail",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const {id} = req.body;
                const user = (req.user) as UserModel;

                const blog = await BlogModel.findByPk(id);
                if(!blog || blog.user_id != user.id){
                    return res.status(200).send(new BaseError("Some error!", BaseError.Code.ERROR).release());
                }

                if(blog.status == BAN){
                    const notification = await NotificationModel.findByPk(blog.id);
                    if(!notification){
                        return res.status(200).send(new BaseError("Some error!", BaseError.Code.ERROR).release());
                    }

                    return res.status(200).send({
                        blog: blog.release(),
                        content: notification.content,
                        code: BaseError.Code.SUCCESS
                    });
                }

                return res.status(200).send({
                    blog: blog.release(),
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};