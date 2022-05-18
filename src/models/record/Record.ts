import { DataTypes, ModelAttributes } from "sequelize";
import {DBModel} from "../../packages/database/DBModel";
import {Table, Column, PrimaryKey} from 'sequelize-typescript';


@Table({
    tableName: 'Records',
    timestamps: false
})
export class RecordModel extends DBModel {

    @PrimaryKey
    @Column
    id: number;
    @Column
    user_id: number;
    @Column
    since: number;
    @Column
    like_number: number;
    @Column
    comment_number: number;
    @Column
    view_number: number;
    @Column
    blog_number: number;
    @Column
    follow_number: number;

    release(){
        return {
            id: this.id,
            user_id: this.user_id,
            since: this.since,
            like_number: this.like_number,
            view_number: this.view_number,
            comment_number: this.comment_number,
            blog_number: this.blog_number,
            follow_number: this.follow_number                                                                                                                                 
        };
    };
}