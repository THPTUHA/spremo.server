import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import {Op} from 'sequelize';
import { castToNumber, wrapAsync } from '../../../services/helper';
import { BlogModel } from '../../../models/blog/blog';
import { MapTagModal } from '../../../models/map.tag/map.tag';
import { BAN, EMOTIONS, PUBLIC } from '../../../Constants';
import { UserModel } from '../../../models/user/user';
import { Sequelize } from 'sequelize-typescript';
import { LikeModel } from '../../../models/core/like';
import passport from "passport";

export default (router: Router) => {
    router.post("/auth.similar",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),  
        wrapAsync(async(req, res)=>{
            try {
                let {id,page, page_size} = req.body;
                page = castToNumber(page)? page : 1;
                page_size = castToNumber(page_size)? page_size : 10;

                const user = req.user as UserModel;

                const blog = await BlogModel.findByPk(id);
                if(!blog){
                    return res.status(200).send(new BaseError("Blog not found!", BaseError.Code.ERROR).release());
                }

                if(blog.status == BAN){
                    return res.status(200).send(new BaseError("You have no right!", BaseError.Code.ERROR).release());
                }

                let list_tag = blog.tags ? JSON.parse(blog.tags).map(tag => tag.toLowerCase()):[];
                list_tag = Array.from(new Set(list_tag));
                
                list_tag = list_tag.filter((e)=>{
                    for(const emotion of EMOTIONS){
                        if(emotion.name == e){
                            return false;
                        }
                    }
                    return true;
                })

                const hash_keys = list_tag.map(tag => {
                    return {
                        hash_key: {
                            [Op.like]: `${tag}#${PUBLIC}#%`
                        }
                    }
                })

                const mapTags = await MapTagModal.paginate({
                    attributes: [[Sequelize.literal('DISTINCT `blog_id`'), 'blog_id']],
                    where: {
                        [Op.or]:hash_keys,
                        blog_id:{
                            [Op.notIn]: [blog.id]
                        }
                    },
                    order: [['id', 'DESC']]
                },{page: 1, page_size: 10});

                let blogs = await BlogModel.findAll({
                    where:{
                        id: mapTags.map(tag => tag.blog_id)
                    }
                })
                
                const users = await  UserModel.findAll({
                    where:{
                        id: blogs.map(blog => blog.user_id)
                    }
                })

                console.log("BLOG______", blogs.map(blog => blog.id))

                const likes = await  LikeModel.findAll({
                    where:{hash_key: blogs.map(blog => LikeModel.createHashKey(blog.id, user.id))}
                });

                return res.status(200).send({
                    likes: likes.map(like => like.release()),
                    bookmarks: user? user.getBookMarks():[],
                    users: users.map(user => user.release()),
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