import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import {Op} from 'sequelize';
import { castToNumber, wrapAsync } from '../../../services/helper';
import { BlogModel } from '../../../models/blog/blog';
import { MapTagModal } from '../../../models/map.tag/map.tag';
import { PUBLIC } from '../../../Constants';
import { UserModel } from '../../../models/user/user';

export default (router: Router) => {
    router.post("/detail",  
        multer({}).fields([]),
        wrapAsync(async(req, res)=>{
            try {
                let {id,page, page_size} = req.body;
                page = castToNumber(page)? page : 1;
                page_size = castToNumber(page_size)? page_size : 10;

                const blog = await BlogModel.findByPk(id);
                if(!blog){
                    return res.status(200).send(new BaseError("Blog not found!", BaseError.Code.ERROR).release());
                }
                let list_tag = blog.tags ? JSON.parse(blog.tags).map(tag => tag.toLowerCase()):[];
                list_tag = Array.from(new Set(list_tag));

                const hash_keys = list_tag.map(tag => {
                    return {
                        hash_key: {
                            [Op.like]: `${tag.name}#${PUBLIC}#%`
                        }
                    }
                })
                const mapTags = await MapTagModal.paginate({
                    where: {
                        [Op.or]:hash_keys,
                    },
                    order: [['id', 'DESC']]
                },{page: 1, page_size: 10});

                let blogs = await BlogModel.findAll({
                    where:{
                        id: mapTags.filter(tag => tag.blog_id != blog.id).map(tag => tag.blog_id)
                    }
                })
                
                const users = await  UserModel.findAll({
                    where:{
                        id: blogs.map(blog => blog.user_id)
                    }
                })

                return res.status(200).send({
                    users: users.map(user => user.release()),
                    blogs: blogs.map(blog => blog.release()),
                    blog: blog.release(),
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};