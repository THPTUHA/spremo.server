import { DataTypes, ModelAttributes } from "sequelize";
import {DBModel} from "../../packages/database/DBModel";
import {Table, Column, PrimaryKey} from 'sequelize-typescript';


@Table({
    tableName: 'Follow',
    timestamps: false
})
export class FollowModel extends DBModel {

    @PrimaryKey
    @Column
    id: number;
    @Column
    user_id: number;
    @Column
    user_follow: number;
    @Column
    since: number;
    @Column
    hash_key: string

    static createHashKey(user_follow: number, user_id: number){
        return user_follow + "#" + user_id;
    }
    release(){
        return {
            id: this.id,
            user_id: this.user_id,
            user_follow: this.user_follow,
            since: this.since,
            hash_key: this.hash_key
        };
    };
}