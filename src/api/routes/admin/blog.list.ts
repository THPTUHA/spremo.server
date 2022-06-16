import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, wrapAsync } from '../../../services/helper';
import { BlogModel } from '../../../models/blog/blog';
import { UserModel } from '../../../models/user/user';
import {PUBLIC, ROLES, SELECTED} from '../../../Constants';
import {time} from '../../../services/helper';
import { LikeModel } from '../../../models/core/like';
export default (router: Router) => {
    router.post("/blog.list",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const {option, page, page_size} = req.body;

                const user = req.user as UserModel;
                if(!user || (!user.is(ROLES.ADMIN) && !user.is(ROLES.CENSOR))){
                    return res.status(200).send(new BaseError("You have no right!", BaseError.Code.ERROR).release());
                }
                const pagination = {
                    page: castToNumber(page),
                    page_size: castToNumber(page_size)
                }

                let blogs = [];
                let blog_number = 0;

                if(option){
                    const data = await BlogModel.findByOption({
                        user: user,
                        option: option,
                        pagination: pagination
                    })
                    blogs = data.blogs;
                    blog_number = data.blog_number;
                } 

                const likes = await  LikeModel.findAll({
                    where:{hash_key: blogs.map(blog => LikeModel.createHashKey(blog.id, user.id))}
                });

                const users = await  UserModel.findAll({
                    where:{
                        id: blogs.map(blog => blog.user_id)
                    }
                })


                return res.status(200).send({
                    blogs: blogs.map(blog => blog.release()),
                    users: users.map(users => users.release()),
                    likes: likes.map(like => like.release()),
                    bookmarks: user? user.getBookMarks():[],
                    blog_number: blog_number,
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};