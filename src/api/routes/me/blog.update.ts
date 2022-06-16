import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, getEmotion, getEmotionIdFromTags, isValidBlogType, isValidStatus, time, updateManyTag, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';
import { BAN, BLOG_TYPES, PRIVATE, PUBLIC } from '../../../Constants';
import { MapTagModal } from '../../../models/map.tag/map.tag';
import { TagModal } from '../../../models/tag/tag';
import { LikeModel } from '../../../models/core/like';

export default (router: Router) => {
    router.post("/blog.update",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            let {data, status, id,url, title,audio, tags} = req.body; 
            console.log("STATUS", status,tags);
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
                        data: JSON.stringify({
                            shapes: JSON.parse(data),
                            url: url
                        }),
                        type: blog.type,
                        last_update: time(),
                        created_time: time(),
                        status: blog.status,
                        like_number: 0
                    })  
                    await blog_new.editHashKey();
                    return res.status(200).send(new BaseError("Save successfull!", BaseError.Code.SUCCESS).release());

                }

                status = castToNumber(status);
                if(!isValidStatus(status)){
                    status = blog.status;
                }

                let list_tag = tags ? JSON.parse(tags).map(tag => tag.trim().toLowerCase()):[];
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
                
                const emotion_ids = getEmotionIdFromTags(list_tag); 

                if(status != PRIVATE && !emotion_ids.length && blog.type != BLOG_TYPES.DRAW ){
                    return res.status(200).send(new BaseError("Emotion tag empty!", BaseError.Code.ERROR).release());
                }
                
                blog.emotion_ids = BlogModel.createEmotionId(emotion_ids);
                blog.status = castToNumber(status);
                blog.last_update = time();
                blog.tags = tags as string;

                const content = JSON.parse(blog.data);

                if(blog.status == PUBLIC){
                    const user_data = user.data ? JSON.parse(user.data):{};
                    const image_user_data = user_data.images ? user_data.images.filter(item => item.blog_id != blog.id) : [];
                    
                    if((blog.type == BLOG_TYPES.COMBINE) || (blog.type == BLOG_TYPES.NOTE)){
                        for(const item of content.blocks){
                            if(item.type == "image"){
                                image_user_data.push({
                                    blog_id: blog.id,
                                    url: item.data.file.url,
                                    since: time()
                                })
                            }
                        }
                    }

                    if( blog.type == BLOG_TYPES.AUDIO || blog.type == BLOG_TYPES.MUSIC){
                        image_user_data.push({
                            blog_id: blog.id,
                            url: content.background,
                            since: time()
                        })
                    }

                    user.data = JSON.stringify({
                        ...user_data,
                        images: image_user_data
                    })

                    await user.edit(["data"]);
                }

                if(data){
                    switch(blog.type){
                        case BLOG_TYPES.COMBINE:
                            blog.data = data;
                            break;
                        case BLOG_TYPES.NOTE:
                            blog.data = data;
                            if(!content.title){
                                return res.status(200).send(new BaseError("Title empty!", BaseError.Code.ERROR).release());
                            }
                            blog.content_search = content.title;
                            break;
                        case BLOG_TYPES.DRAW:
                            blog.data = data;
                            break;
                        case BLOG_TYPES.AUDIO:
                            if(!content.url){
                                return res.status(200).send(new BaseError("", BaseError.Code.ERROR).release());
                            }
                            blog.data  = data;
                            blog.content_search = content.title;
                            break;
                        case BLOG_TYPES.MUSIC:
                            if(!content.url){
                                return res.status(200).send(new BaseError("", BaseError.Code.ERROR).release());
                            }
                            blog.data  = data;
                            blog.content_search = content.name;
                            break;
                    }
                }
                

                if(blog.status != PUBLIC){
                    blog.selected = 0;
                }

                if(blog.selected == null){
                    blog.selected = 0;
                }
                
                blog.editHashKeySync();
                await blog.save();

                const like = await LikeModel.findOne({
                    where:{
                        blog_id: blog.id,
                        user_id: 0
                    }
                })

                if(!like){
                    await LikeModel.saveObject({
                        user_id :0,
                        since :time(),
                        emotion_id : 0,
                        blog_id :blog.id,
                        hash_key :LikeModel.createHashKey(blog.id, 0)
                    })
                }

                await updateManyTag({
                    tags: list_tag,
                    user_id: user.id,
                    blog: blog
                })
                
                
                return res.status(200).send(new BaseError("Save successfull!", BaseError.Code.SUCCESS).release());
                
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};