import { Router } from 'express';
import {Op} from 'sequelize';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { TagModal } from '../../../models/tag/tag';
import { MapTagModal } from '../../../models/map.tag/map.tag';
import { BAN, PUBLIC, SELECTED } from '../../../Constants';
import { BlogModel } from '../../../models/blog/blog';
import { UserModel } from '../../../models/user/user';
import { LikeModel } from '../../../models/core/like';
import { off } from 'process';

export default (router: Router) => {
    router.post("/list",  
        multer({}).fields([{ name: 'image' }, { name: 'audio' }]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const {q ,user_id,option} = req.body;
                let mapTags = [];
                let blogs = [];

                if(option){
                    if(option == 'picked'){
                        blogs = await BlogModel.paginate({
                            where:{
                                selected: SELECTED
                            },
                            order: [["selected_since","DESC"]]
                        },{page: 1,page_size: 10})
                    }else  if(option == 'banned'){
                        blogs = await BlogModel.paginate({
                            where:{
                                status: BAN
                            },
                            order: [["id","DESC"]]
                        },{page: 1,page_size: 10})
                    }

                }else if(q){
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
    
                }else{
                    blogs = await BlogModel.paginate({
                        where:{
                            status: PUBLIC
                        },
                        order: [["last_update","DESC"]]
                    },{page: 1, page_size: 10})
                }

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
                    blogs: blogs.map(blog => blog.release()),
                    users: users.map(users => users.release()),
                    likes: likes.map(like => like.release()),
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