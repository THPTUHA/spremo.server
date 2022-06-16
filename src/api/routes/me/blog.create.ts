import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, getEmotion, getEmotionIdFromTags, isValidBlogType, isValidStatus, time, updateManyTag, updateOneTag, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';
import { BLOG_TYPES, DRAFT, DRAW_IMAGE, PRIVATE, PUBLIC, ROLES } from '../../../Constants';
import { MapTagModal } from '../../../models/map.tag/map.tag';
import { TagModal } from '../../../models/tag/tag';
import { LikeModel } from '../../../models/core/like';

export default (router: Router) => {
    router.post("/blog.create",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            let {data, status, type, url, title,audio, tags} = req.body; 

            try {

                status = castToNumber(status);
                if(!isValidStatus(status)){
                    if(user.is(ROLES.DEVELOPER)) status = DRAFT;
                    else status = PRIVATE;
                }
                
                let list_tag = tags ? JSON.parse(tags).map(tag => tag.trim().toLowerCase()):[];

                const emotion_ids = getEmotionIdFromTags(list_tag); 

                if(!emotion_ids.length && type != BLOG_TYPES.DRAW){
                    return res.status(200).send(new BaseError("Emotion tag empty!", BaseError.Code.ERROR).release());
                }
                
                type = castToNumber(type);
                if(!isValidBlogType(type)){
                    return res.status(200).send(new BaseError("Type invalid!", BaseError.Code.ERROR).release());
                }
                
                const object = {
                    user_id: user.id,
                    data: "",
                    type: type,
                    last_update: time(),
                    created_time: time(),
                    status: status,
                    emotion_ids: BlogModel.createEmotionId(emotion_ids),
                    tags: tags,
                    selected: 0,
                    content_search: ""
                }

                const content = data?JSON.parse(data):{};
                console.log("CONTENT---",content);
                switch(type){
                    case BLOG_TYPES.COMBINE:
                        object.data = data;
                        break;
                    case BLOG_TYPES.NOTE:
                        object.data = data;
                        if(!content.title){
                            return res.status(200).send(new BaseError("Title empty!", BaseError.Code.ERROR).release());
                        }
                        object.content_search = content.title;
                        break;
                    case BLOG_TYPES.DRAW:
                        object.data = JSON.stringify({
                            shapes: [{key: 0}],
                            url: DRAW_IMAGE,
                            description: ""
                        });
                        break;
                    case BLOG_TYPES.AUDIO:
                        if(!content.url){
                            return res.status(200).send(new BaseError("Empty file", BaseError.Code.ERROR).release());
                        }
                        object.data  = data;
                        object.content_search = content.title;
                        break;

                    case BLOG_TYPES.MUSIC:
                        if(!content.url){
                            return res.status(200).send(new BaseError("Empty file", BaseError.Code.ERROR).release());
                        }
                        object.data  = data;
                        object.content_search = content.name;
                        break;
                }

                if(!object.data){
                    return res.status(200).send(new BaseError("Blog must have content!", BaseError.Code.ERROR).release());
                }
                const blog = await BlogModel.saveObject(object);
                await blog.editHashKey();
                
                await updateManyTag({
                    tags: list_tag,
                    user_id: user.id,
                    blog: blog
                })


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

                return res.status(200).send({
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