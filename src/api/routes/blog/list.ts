import { Router } from 'express';
import {Op} from 'sequelize';
import BaseError from '../../../packages/base.error/BaseError';
import passport from "passport"
import { wrapAsync ,castToNumber} from '../../../services/helper';
import { TagModal } from '../../../models/tag/tag';
import { MapTagModal } from '../../../models/map.tag/map.tag';
import { BAN, PRIVATE, PUBLIC, SELECTED } from '../../../Constants';
import { BlogModel } from '../../../models/blog/blog';
import { UserModel } from '../../../models/user/user';
import user from '../user';

export default (router: Router) => {
    router.post("/list",  
        wrapAsync(async(req, res)=>{
            try {
                const {q ,option, page, page_size,username} = req.body;

                const pagination = {
                    page: castToNumber(page),
                    page_size: castToNumber(page_size)
                }
                let mapTags = [];
                let blogs = [];
                let blog_number = 0;
                let user = null;
                if(username){
                    user = await UserModel.findOne({
                        where:{
                            username: username
                        }
                    });
                }

                if(option){
                    const data = await BlogModel.findByOption({
                        option: option,
                        pagination: pagination,
                        user: user
                    })

                    blog_number = data.blog_number;
                    blogs = data.blogs;
                }else if(q){
                    const tags = await TagModal.paginate({
                        where: {
                            name : {
                                [Op.like]: `${q}%`
                            }
                        }
                    },pagination)
        
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
                    },pagination)

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
                    },pagination)
                }

                const users = await  UserModel.findAll({
                    where:{
                        id: blogs.map(blog => blog.user_id)
                    }
                })


                return res.status(200).send({
                    blogs: blogs.map(blog => blog.release()),
                    users: users.map(users => users.release()),
                    likes: [],
                    bookmarks: [],
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