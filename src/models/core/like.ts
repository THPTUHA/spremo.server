import { DataTypes, ModelAttributes } from "sequelize";
import {DBModel} from "../../packages/database/DBModel";
import {Table, Column, PrimaryKey} from 'sequelize-typescript';


@Table({
    tableName: 'Likes',
    timestamps: false
})
export class LikeModel extends DBModel {

    @PrimaryKey
    @Column
    id: number;
    @Column
    user_id :number;
    @Column
    since :number;
    @Column
    emotion_id :number;
    @Column
    blog_id :number;
    @Column
    hash_key :string

    amount: number;
    
    static createHashKey(blog_id: number, user_id: number){
        return blog_id + "#" + user_id;
    }
    release(){
        return {
            id: this.id,
            user_id: this.user_id,
            since: this.since,
            emotion_id: this.emotion_id,
            blog_id: this.blog_id,
            hash_key: this.hash_key
        };
    };
}