import { Column, PrimaryKey, Sequelize, Table } from "sequelize-typescript";
import { BAN, FRIEND, FRIEND_SPECIFIC, PRIVATE, RECORD_TYPE, ROLES } from "../../Constants";
import Crypto from "../../packages/crypto/crypto";
import { DBModel } from "../../packages/database/DBModel";
import { NotificationService } from "../../services/notification/notification";
import { BlogModel } from "../blog/blog";
import { FollowModel } from "../core/follow";
import { RecordModel } from "../record/Record";
import {Op} from 'sequelize';

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
    bookmarks: string

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
        return (this.following ? this.following.split("#").filter(id => id).map(id=>parseInt(id)): []) as number[];
    }

    addFollowing(user_id:number){
        this.following = ( this.following?  this.following: "") + "#"+ user_id+"#";
    }

    getFriends(){
        return (this.friends ? this.friends.split("#").filter(id => id).map(id=>parseInt(id)): []) as number[];
    }
    
    addFriend(user_id: number){
        this.friends = ( this.friends?  this.friends: "") + "#"+ user_id+"#";
    }

    isFriend(user_id: number){
        return this.friends.includes("#"+user_id+"#");
    }

    isFollowing(user_id: number){
        return this.following.includes("#"+user_id+"#");
    }

    deleteFriend(user_id: number){
        this.friends = this.friends.replace("#"+user_id+"#",'');
    }

    deleteFollowing(user_id: number){
        this.following = this.following.replace("#"+user_id+"#",'');
    }
    
    async updateRecord({type, day, value}: {type: number, day: number, value: number}){
        const record = await RecordModel.findOne({
            where: {
                since: day
            }
        })
        let data = {
            comment_number: 0,
            blog_number: 0,
            like_number: 0,
            view_number: 0
        };
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
    
    getBookMarks(){
        return (this.bookmarks? JSON.parse(this.bookmarks): []) as number[]
    }

    async editBookMarks({blog_id}:{blog_id: number}){
        const ids = this.getBookMarks();
        if(ids.includes(blog_id)){
            this.bookmarks = JSON.stringify(ids.filter(id => id!= blog_id));
        }else{
            ids.push(blog_id);
            this.bookmarks = JSON.stringify(ids);
        }
        await this.edit(["bookmarks"]);
    }

    async getBlogsByOtherUser({page, page_size,user_view_id}: {page: number, page_size: number,user_view_id?:number}){
        let q :any= {
            user_id: this.id
        };

        if(this.isFriend(user_view_id)){
            q = {
                ...q,
                [Op.or]:[
                    {
                        status: FRIEND_SPECIFIC,
                        user_views: {
                            [Op.like]: `%#${user_view_id}#%` 
                        }
                    },
                    {
                        status: FRIEND
                    },
                ],
            }
        }

        const blogs = await BlogModel.paginate({
            where :q,
            order: [['id', 'DESC']]
        },{page, page_size})

        const blog_number = await BlogModel.count({
            where: q
        })
        return { blogs, blog_number};
    }
    
    async isHasBlog(blog_id: number){
        
        return await BlogModel.findOne({
            where:{
                id: blog_id,
                user_id: this.id,
            }
        })
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
            data: this.data? JSON.parse(this.data): {
                images: []
            },
            following: this.following ? this.getFollowing():[],
            follower_number: this.follower_number,
            friends: this.friends ? this.getFriends(): [],
            role: this.role,
            active_status: this.active_status,
            bookmarks: this.bookmarks? JSON.parse(this.bookmarks):[]
        }
    }
}