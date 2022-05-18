import { DataTypes, ModelAttributes } from "sequelize";
import {DBModel} from "../../packages/database/DBModel";
import {Table, Column, PrimaryKey} from 'sequelize-typescript';


@Table({
    tableName: 'Notifications',
    timestamps: false
})
export class NotificationModel extends DBModel {

    @PrimaryKey
    @Column
    id: number;
    @Column
    object_id: number;
    @Column
    object_type: string;
    @Column
    user_id: number;
    @Column
    from_id: number;
    @Column
    since: number;
    @Column
    content: string;
    @Column
    link: string;
    @Column
    action: string;
    @Column
    status: number;
    @Column
    last_update: number;

    release(){
        return {
            id: this.id,
            object_id: this.object_id,
            object_type: this.object_type,
            from_id: this.from_id,
            user_id: this.user_id,
            content: this.content,
            since: this.since,
            action: this.action,
            status: this.status,
            link: this.link
        };
    };
}