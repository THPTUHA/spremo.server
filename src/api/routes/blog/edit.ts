import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';
import { BLOG_TYPES } from '../../../Constants';

export default (router: Router) => {
    router.post("/edit",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            let {id} = req.body;

            try {
                if(id){
                    const blog = await BlogModel.findByPk(id);
                    if(blog.type != BLOG_TYPES.DRAW){
                        return res.status(200).send(new BaseError("You have no right!", BaseError.Code.ERROR).release());
                    }
                    
                    return res.status(200).send({
                        blog: blog.release(),
                        code: BaseError.Code.SUCCESS
                    });
                }

                
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};