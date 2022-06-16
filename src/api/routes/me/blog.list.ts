import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, getEmotion, time, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';
import {Op} from 'sequelize';
import { FRIEND, FRIEND_SPECIFIC, PRIVATE, PUBLIC } from '../../../Constants';
import { LikeModel } from '../../../models/core/like';
import follow from '../relationship/follow';
import { Sequelize } from 'sequelize-typescript';

export default (router: Router) => {
    router.post("/blog.list",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            let {page,page_size,emotion_id ,blog_viewed,option,content_search, type} = req.body;

            let blogs = [];
            let likes = [];
            let users = [];
            let blog_number = 0;
            blog_viewed = blog_viewed? JSON.parse(blog_viewed): [];
            page = page? castToNumber(page): 1;

            console.log("PAGE ---",page);
            page_size = page_size? castToNumber(page_size): 10;
            try {
                if(content_search){
                    let q:any = {
                        content_search:{
                            [Op.like]:  `%${content_search}%`
                        },
                        [Op.or]:[
                            {
                                status: PUBLIC,
                            },
                            {
                                status: PRIVATE,
                                user_id: user.id
                            }
                        ]
                    }

                    if(type){
                        q = {
                            ...q,
                            type: type
                        }
                    }

                    
                    blogs = await BlogModel.findAll({
                        where:q
                    })

                    blog_number = await BlogModel.count({
                        where: q
                    })

                }else if(option){
                    const data = await BlogModel.findByOption({
                        option: option,
                        user: user,
                        emotion_id: emotion_id,
                        blog_viewed: blog_viewed,
                        pagination: {
                            page: page,
                            page_size: page_size
                        }
                    })

                    blogs = data.blogs;
                    blog_number = data.blog_number;
                }else if(emotion_id){
                    const emotion = getEmotion(emotion_id);

                    const current = time() - 7 * 24 * 3600;
                    
                    const following = user.getFollowing();
                    const friends = user.getFriends();

                    const hash_key_following = following.map(follow =>{
                        return {
                            [Op.like]: `${follow}#${PUBLIC}#%`  
                        }
                    })

                    console.log("Hash_Key_FOLLOWING....",hash_key_following);
                    
                    const hash_key_friend = friends.map(friend =>{
                        return {
                            [Op.like]: `${friend}#${FRIEND}#%`  
                        }
                    })

                    const hash_key_friend_specific = friends.map(friend =>{
                        return {
                            [Op.like]: `${friend}#${FRIEND_SPECIFIC}#%`  
                        }
                    })
                    
                    const q = {
                        id:{
                            [Op.notIn]: blog_viewed,
                        },
                        [Op.or]:[
                            {
                                hash_key: {
                                    [Op.or]: hash_key_following
                                },
                            },
                            {
                                hash_key: {
                                    [Op.or]: hash_key_friend_specific
                                },
                                user_views: {
                                    [Op.like]: `%#${user.id}#%` 
                                }
                            },
                            {
                                hash_key: {
                                    [Op.or]: hash_key_friend
                                },
                            }
                        ],
                        emotion_ids:{
                            [Op.like]: `%#${emotion.id}#%`  
                        }
                    }

                    blogs = await BlogModel.paginate({
                        where: q,
                        order: Sequelize.literal('rand()'),
                    },{page, page_size})

                    blog_number = await BlogModel.count({
                        where: q,
                    })

                    for(const blog of blogs){
                        blog_viewed.push(blog.id);
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
                    bookmarks: user? user.getBookMarks():[],
                    blog_viewed, 
                    blog_number,
                    code: BaseError.Code.SUCCESS,
                });
                
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};