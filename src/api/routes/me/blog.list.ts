import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, getEmotion, time, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';
import {Op} from 'sequelize';
import { FRIEND, FRIEND_SPECIFIC, PUBLIC } from '../../../Constants';
import { LikeModel } from '../../../models/core/like';

export default (router: Router) => {
    router.post("/blog.list",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            let {page,page_size, my_blog,emotion_id , friend_position, following_position, friend_spe_position,blog,option} = req.body;
            let blogs = [];
            let likes = [];
            let users = [];

            page = castToNumber(page)? page : 1;
            page_size = castToNumber(page_size)? page_size : 10;

            try {
                if(my_blog){
                    if(blog){
                        blogs = await BlogModel.findAll({
                            where: {
                                id: blog,
                                user_id: user.id
                            }
                        })
                    }else if(option == 'mark'){
                        const blog_ids = user.getBlogSaved();
                        blogs = await BlogModel.findAll({
                            where:{id: blog_ids}
                        })
                    }else{
                        blogs = await user.getBlogs({page: page, page_size: page_size, user_id: user.id});
                    }
                }else{
                    if(emotion_id){
                        const emotion = getEmotion(emotion_id);
                        console.log("EMOTION--------",emotion);

                        const current = time() - 7 * 24 * 3600;
                        const friends = user.friends ? JSON.parse(user.friends): [];
                        
                        const result = await BlogModel.get({
                            option: FRIEND_SPECIFIC,
                            postion: friend_spe_position,
                            page: page,
                            searchs: friends,
                            emotion: emotion.name,
                            user_id: user.id,
                            current: current
                        })

                        friend_spe_position = result.postion;
                        blogs = result.blogs;
                        
                        if(blogs.length < 6){
                           const result = await BlogModel.get({
                            option: FRIEND,
                            postion: friend_position,
                            page: page,
                            searchs: friends,
                            emotion: emotion.name,
                            user_id: user.id,
                            current: current
                           })
                           friend_position = result.postion;
                           blogs.push(...result.blogs);

                           if(blogs.length < 6){
                                const following = user.getFollowing();
                                following.push({
                                    user_id: user.id,
                                    status: PUBLIC
                                });
                                const result = await BlogModel.get({
                                    option: PUBLIC,
                                    postion: following_position,
                                    page: page,
                                    searchs: following,
                                    emotion: emotion.name,
                                    user_id: user.id,
                                    current: current
                                })
                                following_position = result.postion;
                                blogs.push(...result.blogs);
                           }
                        }
                    }
                }

                if(blogs.length){
                    likes = await  LikeModel.findAll({
                        where:{hash_key: blogs.map(blog => LikeModel.createHashKey(blog.id, user.id))}
                    });
                    
                    users = await UserModel.findAll({
                        where: {id: blogs.map(blog => blog.user_id)}
                    })

                }

                return res.status(200).send({
                    blogs: blogs.map((blog)=>blog.release()),
                    likes: likes.map((like)=>like.release()),
                    users: users.map((user)=> user.release()),
                    friend_position: friend_position, 
                    following_position: following_position, 
                    friend_spe_position: friend_spe_position,
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