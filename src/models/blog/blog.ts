import { Column, PrimaryKey, Table } from "sequelize-typescript";
import { BLOG_TYPES, FRIEND, FRIEND_SPECIFIC, PUBLIC } from "../../Constants";
import Crypto from "../../packages/crypto/crypto";
import { DBModel } from "../../packages/database/DBModel";
import { castToNumber, getEmotion } from "../../services/helper";
import { NotificationService } from "../../services/notification/notification";
import { CommentModel } from "../comment/comment";
import { LikeModel } from "../core/like";
import { UserModel } from "../user/user";
import {Op} from 'sequelize';
import { MapTagModal } from "../map.tag/map.tag";


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
    like_number: number;
    @Column
    comment_number: number;
    @Column
    user_views: string;
    @Column
    selected: number;
    @Column
    selected_since:  number;

    async editHashKey(emotion: {id: number, name: string}){
        this.hash_key = emotion.name + "#" + this.status + "#" + this.user_id + "#" + this.id;
        await this.edit(["hash_key"]);
        return  this.hash_key;
    }

    editHashKeySync(emotion: {id: number, name: string}){
        return   emotion.name + "#" + this.status + "#" + this.user_id + "#" + this.id;;
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
        console.log("POSITIOn----",postion);
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

    async onBan(blog: BlogModel, user: UserModel, reason: string){
        NotificationService.init()
        .object(blog)
        .from(user)
        .setAction('ban_blog')
        .setLink(`/blog/${user.username}?blog=${blog.id}`)
        .setContent(`Blog của bạn đã bị ban do ${reason}`)
        .setExcept([])
        .setReceivers([user])
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
            comment_number: this.comment_number,
            selected: this.selected,
        }
    }
}