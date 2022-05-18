import { Column, PrimaryKey, Table } from "sequelize-typescript";
import { FRIEND_SPECIFIC, RECORD_TYPE, ROLES } from "../../Constants";
import Crypto from "../../packages/crypto/crypto";
import { DBModel } from "../../packages/database/DBModel";
import { NotificationService } from "../../services/notification/notification";
import { BlogModel } from "../blog/blog";
import { FollowModel } from "../core/follow";
import { RecordModel } from "../record/Record";

interface Follow{
    user_id: number,
    status: number
}

interface Friend{
    user_id: number,
    username: string
}

interface Blog{
    id: number,
    status: number
}

interface Record{
    like_number: number,
    view_number: number,
    comment_number: number,
    blog_number: number
}
@Table({
    tableName: 'Users',
    timestamps: false
})

export class UserModel extends DBModel{
    @PrimaryKey
    @Column
    id: number;
    @Column
    username: string;
    @Column
    email: string;
    @Column
	password: string;
    @Column
    avatar: string;
    @Column
    background: string;
    @Column
	contact: string;
    @Column
    sex: number;
    @Column
    description: string;
    @Column
    role: number;
    @Column
    last_login: number;
    @Column
    emotion_id: number;
    @Column
    blog_ids: string;
    @Column
    chat_ids: string;
    @Column
    last_update: number;
    @Column
    active_status: number;
    @Column
    data: string;
    @Column
    day_of_birth: number;
    @Column
    emotion_last_update: number;
    @Column
    follower_number: number;
    @Column
    following: string;
    @Column
    friends: string
    @Column
    blog_saved: string

    static BANNED = -2;
    static UNACTIVE = -1;
    static ACTIVED = 2;
    static ACTIVE = 3;
    static LOGIN = 4;

    static checkCorrectPassword(username: string, check_password: string, password: string) {
        if (Crypto.hashUsernamePassword(username, check_password) === password) {
            return true;
        } else {
            return false;
        }
    }

    isActiveAccount(){
        return this.active_status != UserModel.UNACTIVE && this.active_status != UserModel.BANNED;
    }
    
    getFollowing(){
        return (this.following ? JSON.parse(this.following): []) as Follow[];
    }

    getFriends(){
        return (this.friends ? JSON.parse(this.friends): []) as Friend[];
    }
    
    async updateRecord({type, day, value}: {type: number, day: number, value: number}){
        const record = await RecordModel.findOne({
            where: {
                since: day,
                user_id: this.id
            }
        })

        let data = (this.data ? JSON.parse(this.data): {}) as Record;
        switch(type){
            case RECORD_TYPE.COMMENT:
                data = {
                    ...data,
                    comment_number: data.comment_number ? data.comment_number + value: (value > 0 ? 1: 0)
                }
                if(record){
                    record.comment_number += value;
                    await record.edit(["comment_number"]);
                }
                break;
            case RECORD_TYPE.BLOG:
                data = {
                    ...data,
                    blog_number: data.blog_number ? data.blog_number + value: (value > 0 ? 1: 0)
                }
                if(record){
                    record.blog_number += value;
                    await record.edit(["blog_number"]);
                }
                break;
            case RECORD_TYPE.LIKE:
                data = {
                    ...data,
                    like_number: data.like_number ? data.like_number + value: (value > 0 ? 1: 0)
                }
                if(record){
                    record.like_number += value;
                    await record.edit(["like_number"]);
                }
                break;
            case RECORD_TYPE.VIEW:
                data = {
                    ...data,
                    view_number: data.view_number ? data.view_number + value: (value > 0 ? 1: 0)
                }
                if(record){
                    record.view_number += value;
                    await record.edit(["view_number"]);
                }
                break;
            case RECORD_TYPE.FOLLOW:
                if(record){
                    record.follow_number += value;
                    await record.edit(["follow_number"]);
                }
                break;
        }

        if(!record){
            await RecordModel.saveObject({
                user_id: this.id,
                since: day,
                like_number: 0,
                view_number: 0,
                comment_number: 0,
                blog_number: 0,
                follow_number: 0,
                ...data
            })
        }
    }

    async addBlog(blog_id: number, status: number){
        const blogs = this.blog_ids? JSON.parse(this.blog_ids): [];
        blogs.push({
            id: blog_id,
            status: status
        });
        this.blog_ids = JSON.stringify(blogs);
        await this.edit(["blog_ids"]);
    }

    async deleteBlog(blog_id: number){
        const blogs = this.blog_ids? JSON.parse(this.blog_ids): [];
        for(let i = 0;i < blogs.length; ++i){
            if(blogs[i].id == blog_id){
                blogs.splice(i,1);
                break;
            }
        }
        this.blog_ids = JSON.stringify(blogs);
        await this.edit(["blog_ids"]);
    }

    async editBlog(blog_id: number, status: number){
        const blogs = (this.blog_ids? JSON.parse(this.blog_ids): []) as Blog[];
        for(let i = 0;i < blogs.length; ++i){
            if(blogs[i].id == blog_id){
                blogs[i] = {
                    id: blog_id,
                    status: status
                }
                break;
            }
        }
        this.blog_ids = JSON.stringify(blogs);
        await this.edit(["blog_ids"]);
    }
    
    getBlogSaved(){
        return (this.blog_saved? JSON.parse(this.blog_saved): []) as number[]
    }

    async editBlogSaved({blog_id,is_delete}:{blog_id: number, is_delete?: boolean}){
        const ids = this.getBlogSaved();
        if(is_delete){
            this.blog_saved = JSON.stringify(ids.filter(id => id!= blog_id));
        }else{
            ids.push(blog_id);
            this.blog_saved = JSON.stringify(ids);
        }
        await this.edit(["blog_saved"]);
    }

    async getBlogs({page, page_size, status,user_id}: {page: number, page_size: number, status?: number[],user_id?:number}){
        let blogs = (this.blog_ids? JSON.parse(this.blog_ids): []) as Blog[];
        let ids = [];
        if(status){
            ids = blogs.filter(blog =>  status.includes(blog.status)).map(blog => blog.id);
        }else{
            ids = blogs.map(blog => blog.id);
        }
        let blog_result = [] as BlogModel[];
        // const ids = blogs.splice(Math.max(0,blogs.length - page* page_size), 
        //             Math.min(blogs.length, page_size))
        //             .map(blogs => blogs.id)
        console.log("IDS...........", ids);
        const result = [];
        if(ids.length){
            blog_result = await BlogModel.findAll({
                where:{
                    id: ids
                },
                order: [['id', 'DESC']]
            })
            for(let i = 0; i< blog_result.length ;++i){
                if(blog_result[i].status ==  FRIEND_SPECIFIC){
                    if(blog_result[i].user_id == user_id||blog_result[i].getUserView().includes(user_id)){
                        result.push(blog_result[i])
                    }   
                }else{
                    result.push(blog_result[i])
                }
            }
        }
        return result;
    }
    
    isHasBlog(blog_id: number){
        const blogs = this.blog_ids ? JSON.parse(this.blog_ids): [];
        for(let i = 0; i < blogs.length; ++i){
            if(blogs[i].id == blog_id){
                return true;
            }
        }
        return false;
    }


    is(role: number){
        return role == this.role;
    }

    async onFriend(follow: FollowModel , user: UserModel,user_follow: UserModel){
        NotificationService.init()
        .object({id: follow.id, object_type:"friend"})
        .from(user)
        .setAction('be_friend')
        .setLink(``)
        .setContent(`<b>${user.username}</b> và <b>${user_follow.username}</b> đã trở thành bạn`)
        .setExcept([])
        .setReceivers([user,user_follow])
        .send();
    }

    release(){
        return {
            id: this.id,
            username: this.username,
            avatar: this.avatar,
            background: this.background,
            emotion_id: this.emotion_id,
            data: this.data? JSON.parse(this.data): {},
            following: this.following ? JSON.parse(this.following):[],
            follower_number: this.follower_number,
            friends: this.friends ? JSON.parse(this.friends): [],
            role: this.role,
            blog_saved: this.blog_saved? JSON.parse(this.blog_saved):[]
        }
    }
}