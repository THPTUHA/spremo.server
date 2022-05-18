import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, getEmotion, isValidBlogType, isValidStatus, time, updateManyTag, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';
import { BAN, BLOG_TYPES, PRIVATE, PUBLIC } from '../../../Constants';
import { MapTagModal } from '../../../models/map.tag/map.tag';
import { TagModal } from '../../../models/tag/tag';

export default (router: Router) => {
    router.post("/blog.update",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            let {data, status, id, url, title,audio, tags} = req.body; 

            try {
                id = castToNumber(id);
                if(!id){
                    return res.status(200).send(new BaseError("Id invalid!", BaseError.Code.ERROR).release());
                }
                                
                const blog = await BlogModel.findByPk(id);
                if(!blog){
                    return res.status(200).send(new BaseError("Blog not found!", BaseError.Code.ERROR).release());
                }

                if(blog.status == BAN){
                    return res.status(200).send(new BaseError("You can't update blog!", BaseError.Code.ERROR).release());
                }
                
                if(blog.user_id != user.id){
                    console.log("OK")
                    if(blog.type != BLOG_TYPES.DRAW)
                        return res.status(200).send(new BaseError("You have no right!", BaseError.Code.ERROR).release());
                    console.log("OCONTINUE_____");
                    
                    const blog_new = await BlogModel.saveObject({
                        user_id: user.id,
                        data: blog.data = JSON.stringify({
                            shapes: JSON.parse(data),
                            url: url
                        }),
                        type: blog.type,
                        last_update: time(),
                        created_time: time(),
                        status: blog.status,
                        like_number: 0
                    })  
                    await blog_new.editHashKey(getEmotion(user.emotion_id));
                    await user.addBlog(blog_new.id, PRIVATE);
                    return res.status(200).send(new BaseError("Save successfull!", BaseError.Code.SUCCESS).release());

                }

                status = castToNumber(status);
                if(!isValidStatus(status)){
                    status = blog.status;
                }

                blog.last_update = time();

                const emotion_name = blog.hash_key.split("#")[0] ;

                let list_tag = tags ? JSON.parse(tags).map(tag => tag.trim().toLowerCase()):[];
                list_tag.push(emotion_name);
                const tags_temp = []
                for(let tag_init of list_tag){
                    if(tag_init){
                        tags_temp.push(tag_init);
                        const tags = tag_init.split(/\s+/);
                        for(let tag of tags){
                            if(tag)tags_temp.push(tag)
                        }
                    }
                }
                list_tag = Array.from(new Set(tags_temp)) as string[];
                if(!tags){
                    tags = blog.tags;
                }
                blog.tags = tags;
                blog.status = status;
                
                if(data){
                    switch(blog.type){
                        case BLOG_TYPES.COMBINE:
                            blog.data = data;
                            break;
                        case BLOG_TYPES.DRAW:
                            blog.data = JSON.stringify({
                                shapes: JSON.parse(data),
                                url: url
                            });
                            break;
                        case BLOG_TYPES.AUDIO:
                            if(audio){
                                const data :any= {
                                    url: audio
                                }
                                if(title){
                                    data.title = title;
                                }

                                const data_init = JSON.parse(blog.data);
                                blog.data  = JSON.stringify({
                                    ...data_init,
                                    ...data
                                });
                            }
                            break;
                    }
                }
                
                await blog.edit(["last_update","status","data","tags"]);

                if(emotion_name){
                    await blog.editHashKey({name: emotion_name, id: 0});
                }

                await updateManyTag({
                    tags: list_tag,
                    user_id: user.id,
                    blog: blog
                })
                
                await user.editBlog(blog.id, blog.status);
                if(blog.status != PUBLIC){
                    blog.selected = 0;
                    await blog.edit(["selected"]);
                }
                
                return res.status(200).send(new BaseError("Save successfull!", BaseError.Code.SUCCESS).release());
                
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};