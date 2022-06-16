import { Router } from 'express';
import {Op} from 'sequelize';
import BaseError from '../../../packages/base.error/BaseError';
import passport from "passport"
import { wrapAsync ,castToNumber} from '../../../services/helper';
import { TagModal } from '../../../models/tag/tag';
import { MapTagModal } from '../../../models/map.tag/map.tag';
import { BAN, PUBLIC, SELECTED } from '../../../Constants';
import { BlogModel } from '../../../models/blog/blog';
import { UserModel } from '../../../models/user/user';
import multer from 'multer';
import { LikeModel } from '../../../models/core/like';

export default (router: Router) => {
    router.post("/auth.list",
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),  
        wrapAsync(async(req, res)=>{
            try {
                const {q ,option, page, page_size} = req.body;

                const user = req.user as UserModel;

                const pagination = {
                    page: castToNumber(page),
                    page_size: castToNumber(page_size)
                }
                let mapTags = [];
                let blogs = [];

                if(option){
                    const data = await BlogModel.findByOption({
                        option: option,
                        pagination: pagination
                    })

                    blogs = data.blogs;
                }
                
                if(q){
                    const tags = await TagModal.paginate({
                        where: {
                            name : {
                                [Op.like]: `${q}%`
                            }
                        }
                    },{page: 1, page_size: 10})
        
                    const hash_keys = tags.map(tag => {
                        return {
                            hash_key: {
                                [Op.like]: `${tag.name}#${PUBLIC}#%`
                            }
                        }
                    })
                    
                    mapTags = await MapTagModal.paginate({
                        where: {
                            [Op.or]:hash_keys,
                        },
                        order: [['id', 'DESC']]
                    },{page: 1, page_size: 10})

                    blogs = await BlogModel.findAll({
                        where:{
                            id: mapTags.map(tag => tag.blog_id)
                        }
                    })
    
                }else if(!option){
                    blogs = await BlogModel.paginate({
                        where:{
                            status: PUBLIC
                        },
                        order: [["last_update","DESC"]]
                    },{page: 1, page_size: 10})
                }

                const users = await  UserModel.findAll({
                    where:{
                        id: blogs.map(blog => blog.user_id)
                    }
                })

                const likes = await  LikeModel.findAll({
                    where:{hash_key: blogs.map(blog => LikeModel.createHashKey(blog.id, user.id))}
                });

                return res.status(200).send({
                    blogs: blogs.map(blog => blog.release()),
                    users: users.map(user => user.release()),
                    likes: likes.map(like => like.release()),
                    bookmarks: user? user.getBookMarks():[],
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};