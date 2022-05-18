import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';

export default (router: Router) => {
    router.post("/get",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            let {page,page_size} = req.body;

            page = castToNumber(page)? page : 1;
            page_size = castToNumber(page_size)? page_size : 5;

            try {
                const blogs = await user.getBlogs({page, page_size});

                return res.status(200).send({
                    blogs: blogs.map((blog)=>blog.release()),
                    code: BaseError.Code.SUCCESS
                });
                
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};