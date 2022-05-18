import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { BlogModel } from '../../../models/blog/blog';
import { PUBLIC } from '../../../Constants';
import { LikeModel } from '../../../models/core/like';
import { UserModel } from '../../../models/user/user';

export default (router: Router) => {
    router.post("/trending",  
        multer({}).fields([]),
        wrapAsync(async(req, res)=>{
            try {
                const {user_id} = req.body;
                const blogs = await BlogModel.paginate({
                    where:{
                        status : PUBLIC
                    },
                    order: [["like_number","DESC"]]
                },{page: 1,page_size: 10})

                const user = await UserModel.findByPk(user_id);
                
                const likes = await  LikeModel.findAll({
                    where:{hash_key: blogs.map(blog => LikeModel.createHashKey(blog.id, user_id))}
                });

                const users = await  UserModel.findAll({
                    where:{
                        id: blogs.map(blog => blog.user_id)
                    }
                })

                return res.status(200).send({
                    users: users.map(users => users.release()),
                    likes: likes.map(like => like.release()),
                    blogs: blogs.map(blog =>blog.release()),
                    blog_saved: user? user.getBlogSaved():[],
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};