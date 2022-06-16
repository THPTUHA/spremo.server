import { Column, PrimaryKey, Sequelize, Table } from "sequelize-typescript";
import { BAN, BLOG_TYPES, FRIEND, FRIEND_SPECIFIC, PUBLIC, ROLES, SELECTED } from "../../Constants";
import Crypto from "../../packages/crypto/crypto";
import { DBModel } from "../../packages/database/DBModel";
import { castToNumber, getEmotion, time } from "../../services/helper";
import { NotificationService } from "../../services/notification/notification";
import { CommentModel } from "../comment/comment";
import { LikeModel } from "../core/like";
import { UserModel } from "../user/user";
import {Op, where} from 'sequelize';
import { MapTagModal } from "../map.tag/map.tag";
import blog from "../../api/routes/blog";


@Table({
    tableName: 'Blogs',
    timestamps: false
})

export class BlogModel extends DBModel{
    @PrimaryKey
    @Column
    id: number;
    @Column
    user_id: number;
    @Column
    data: string;
    @Column
    last_update: number;
    @Column
    hash_key: string;
    @Column
    created_time: number;
    @Column
    status: number;
    @Column
    type: number;
    @Column
    tags: string;
    @Column
    user_views: string;
    @Column
    selected: number;
    @Column
    selected_since:  number;
    @Column
    emotion_ids:  string;
    @Column
    content_search:  string;

    like_number: number;

    async editHashKey(){
        this.hash_key =  this.user_id + "#" + this.status + "#" + this.id;
        await this.edit(["hash_key"]);
        return  this.hash_key;
    }

    editHashKeySync(){
        this.hash_key =  this.user_id + "#" + this.status + "#" + this.id;
    }
    
    getTypeRaw(){
        const keys = Object.keys(BLOG_TYPES);
        for(const i in keys){
            if(BLOG_TYPES[keys[i]] == this.type) return keys[i] ;
        }
        return "";
    }


    getUserView(){
        return (this.user_views ? JSON.parse(this.user_views): []) as number[]
    }

    getTags(){
        return (this.tags? JSON.parse(this.tags).map(tag => tag.toLowerCase()) : []) as string[]
    }

    getEmoionId(){
        return this.emotion_ids.split("#").filter(id => id);
    }

    static createEmotionId(emotion_ids: number[]){
        return emotion_ids.map(id => "#"+id+"#").join('');
    }

    static async findByOption({option, user,pagination,emotion_id,blog_viewed}:{option: string, user ?: UserModel, pagination:any, emotion_id?: number, blog_viewed?: number[]}){
        let blogs = [];
        let blog_number = 0;
        switch(option){
            case "view":
                if(user){
                    blogs = await BlogModel.findAll({
                        where:{
                            user_id: user.id,
                            status: PUBLIC
                        },
                        order: [["id","DESC"]]
                    });
                    blog_number = await BlogModel.count({
                        where:{
                            user_id: user.id,
                            status: PUBLIC
                        }
                    });
                }
                break;
            case "bookmark":
                if(user){
                    blogs = await BlogModel.findAll({
                        where:{id: user.getBookMarks()}
                    });
                    blog_number = user.getBookMarks().length;
                }
                break;
            case 'picked':
                blogs = await BlogModel.paginate({
                    where:{
                        selected: SELECTED
                    },
                    order: [["selected_since","DESC"]]
                },pagination)

                blog_number = await BlogModel.count({
                    where:{
                        selected: SELECTED
                    }
                })
                break;
            case 'banned':
                blogs = await BlogModel.paginate({
                    where:{
                        status: BAN
                    },
                    order: [["id","DESC"]]
                },pagination)

                blog_number = await BlogModel.count({
                    where:{
                        status: BAN
                    }
                })
                break;
            case 'trending':
                blogs = await this.sequelize.query(`SELECT * FROM Blogs,(Select blog_id ,count(*) as like_number from LIKES where likes.since > ${time() - 7 *3600 * 24}
                group by  blog_id)  AS like_temp where like_temp.blog_id = id and Blogs.status = ${PUBLIC}
                ORDER BY like_temp.like_number DESC LIMIT  ${pagination.page_size * (pagination.page - 1)}, ${pagination.page_size};`)

                for(const blog of blogs[0]){
                    if(blog){
                        blog.release = ()=>{
                            return {
                                ...blog,
                                data: blog.data? JSON.parse(blog.data): {},
                                tags: blog.tags? JSON.parse(blog.tags):[],
                            }
                        }
                    }
                }

                blogs = blogs[0];
                console.log("BLOG_--",blogs);
                blog_number = await BlogModel.count({
                    where:{
                        status : PUBLIC
                    }
                })
                break;

            case 'staff-picks':
                blogs = await BlogModel.paginate({
                    where:{
                        selected: SELECTED,
                        status: PUBLIC
                    },
                    order: [["selected_since","DESC"]]
                },pagination)

                blog_number = await BlogModel.count({
                    where:{
                        selected: SELECTED,
                        status: PUBLIC
                    }
                })
                break;
            case 'my-blog':
                if(user){
                    blogs = await BlogModel.paginate({
                        where:{
                            user_id: user.id
                        },
                        order: [["id","DESC"]]
                    },pagination);

                    blog_number = await BlogModel.count({
                        where:{
                            user_id: user.id
                        }
                    })
                }
                break;
            case 'my-blog-banned':
                if(user){
                    blogs = await BlogModel.paginate({
                        where:{
                            user_id: user.id,
                            status: BAN
                        }
                    },pagination);

                    blog_number = await BlogModel.count({
                        where:{
                            user_id: user.id,
                            status: BAN
                        }
                    })
                }
                break;
            case 'recommended':
                if(user){
                    const following = user.getFollowing();
                    following.push(user.id)
                    blogs = await BlogModel.paginate({
                        where:{
                            id:{
                                [Op.notIn]:blog_viewed
                            },
                            user_id: {
                                [Op.notIn]: following
                            },
                            emotion_ids: {
                                [Op.like]: `%#${emotion_id}#%`
                            },
                            status: PUBLIC
                        },
                        order: Sequelize.literal('rand()'),
                    },pagination);

                    blog_number = await BlogModel.count({
                        where:{
                            id:{
                                [Op.notIn]:blog_viewed
                            },
                            user_id: {
                                [Op.notIn]: following
                            },
                            emotion_ids: {
                                [Op.like]: `%#${emotion_id}#%`
                            },
                            status: PUBLIC
                        },
                    })
                }
                break;
            case 'admin':
                if(user && ((user.is(ROLES.ADMIN)) || (user.is(ROLES.CENSOR)))){
                    const q = {
                        status: PUBLIC,
                        selected:{
                            [Op.not]: SELECTED
                        }
                    };
                    console.log("Query----",q);
                    blogs = await BlogModel.paginate({
                        where: q,
                        order: [["id","DESC"]]
                    },pagination);

                    blog_number = await BlogModel.count({
                        where: q
                    })
                }
                break;
        }
        return {
            blogs, blog_number
        };  
    }

    static async get({option,postion, searchs,emotion,page, current,user_id}:{option: number,postion: number, searchs: any[],emotion:string, page: number,current: number, user_id: number}){
        postion = castToNumber(postion);
        if(postion != NaN && postion < -1){
            return {
                blogs: [],
                postion: -2
            }
        }
        postion = (postion != NaN && postion >= 0) ? postion : searchs.length - 1;
        let ids = [];
        let blogs = [];
        let blogs_temp = [];
        for(let i = postion ; i >= 0; --i){
            ids.push(searchs[i].user_id);
            postion--;

            if(ids.length >= page){
                const query = ids.map(id =>{
                    return {
                        [Op.like]: `${emotion}#${option}#${id}#%`  
                    }
                });
                const map_tags = await MapTagModal.findAll({
                    where:{
                        hash_key: {
                            [Op.or]: query 
                        }
                    }
                })

                if(map_tags.length){
                    blogs_temp = await BlogModel.findAll({
                        where: {
                            id: map_tags.map(tag => tag.blog_id)
                        }
                    });
                }
                if(option == FRIEND_SPECIFIC){
                    for(let j = 0; j < blogs_temp.length ;++j){
                        const user_views = blogs_temp[j].getUserView();
                        if(user_views.includes(user_id)){
                            blogs.push(blogs_temp[j]);
                        }
                    }
                }else{
                    for(let j = 0 ; j < blogs_temp.length ;++j ){
                        blogs.push(blogs_temp[j]);
                    }
                }
                console.log("BLOG.....",blogs);
                ids = [];
                if(blogs.length >=  6) break;
                blogs_temp = [];
            }
        }

        if(ids.length){
            const query = ids.map(id =>{
                return {
                    [Op.like]: `${emotion}#${option}#${id}#%`  
                }
            });
            console.log("QUERY---",option, query);
            const map_tags = await MapTagModal.findAll({
                where:{
                    hash_key: {
                        [Op.or]: query 
                    }
                }
            })
            let blogs_temp = await BlogModel.findAll({
                where: {
                    id: map_tags.map(tag => tag.blog_id)
                }
            });
            if(option == FRIEND_SPECIFIC){
                for(let j = 0; j < blogs_temp.length ;++j){
                    const user_views = blogs_temp[j].user_views ? JSON.parse(blogs_temp[j].user_views): [];
                    if(user_views.includes(user_id)){
                        blogs.push(blogs_temp[j]);
                    }
                }
            }else{
                for(let j = 0 ; j < blogs_temp.length ;++j ){
                    blogs.push(blogs_temp[j]);
                }
            }
        }
        return {
            blogs: blogs,
            postion: postion == -1 ? -2 : postion
        }
    }
    async onComment(comment: CommentModel, user: UserModel,user_revicers: UserModel[]){
        NotificationService.init()
        .object(comment)
        .from(user)
        .setAction('comment_blog')
        .setLink(`/blogs/${this.id}`)
        .setContent(`<b>${user.username}</b> đã bình luận vào blog của bạn`)
        .setExcept([user])
        .setReceivers(user_revicers)
        .send();
    }

    async onLike(like: LikeModel, user: UserModel,user_revicers: UserModel[]){
        NotificationService.init()
        .object({id: like.id, object_type:"like"})
        .from(user)
        .setAction('like_blog')
        .setLink(`/blogs/${this.id}`)
        .setContent(`<b>${user.username}</b> đã bày tỏ cảm xúc với blog của bạn`)
        .setExcept([user])
        .setReceivers(user_revicers)
        .send();
    }

    async onBan(blog: BlogModel, user: UserModel,user_revicers: UserModel, reason: string){
        NotificationService.init()
        .object(blog)
        .from(user)
        .setAction('ban_blog')
        .setLink(`/blog/banned/${user.username}/${blog.id}`)
        .setContent(`Blog của bạn đã bị ban do ${reason}`)
        .setExcept([])
        .setReceivers([user_revicers])
        .send();
    }

    release(){
        return {
            id: this.id,
            user_id: this.user_id,
            data: this.data? JSON.parse(this.data): {},
            hash_key: this.hash_key,
            last_update: this.last_update,
            type: this.type,
            tags: this.tags? JSON.parse(this.tags):[],
            status: this.status,
            created_time: this.created_time,
            like_number: this.like_number,
            selected: this.selected,
        }
    }
}