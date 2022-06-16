import { Column, PrimaryKey, Table } from "sequelize-typescript";
import { DBModel } from "../../packages/database/DBModel";
import { BlogModel } from "../blog/blog";


@Table({
    tableName: 'Settings',
    timestamps: false
})

export class SettingModel extends DBModel{
    @PrimaryKey
    @Column
    id: number;
    @Column
    user_id: number;
    @Column
    emotion_id: number; 
    @Column
    status: number;
    @Column
    action: string;
    @Column
    type: string;
    @Column
    data: string;
    
    blogs: BlogModel[];

    release(){
        return {
            id: this.id,
            user_id: this.user_id,
            emotion_id: this.emotion_id,
            status: this.status,
            action: this.action,
            type: this.type,
            data: this.data? JSON.parse(this.data): {},
            blogs: this.blogs? this.blogs.map(blog => blog.release()):[],
        }
    }
}