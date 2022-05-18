import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { FRIEND, FRIEND_SPECIFIC, PUBLIC } from '../../../Constants';

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

                const blogs = await user.getBlogs({page: 1, page_size: 10, status: [PUBLIC,FRIEND, FRIEND_SPECIFIC], user_id: user.id});
                return res.status(200).send({
                    owner: user.release(),
                    blogs: blogs.map(blog => blog.release()),
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};