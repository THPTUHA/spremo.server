import { Column, PrimaryKey, Table } from "sequelize-typescript";
import Crypto from "../../packages/crypto/crypto";
import { DBModel } from "../../packages/database/DBModel";


@Table({
    tableName: 'Chats',
    timestamps: false
})

export class ChatModel extends DBModel{
    @PrimaryKey
    @Column
    id: number;
    @Column
    user_ids: string;
    @Column
    created_time: string;
    @Column
    status: number;
    @Column
    avatar: string;

    getUserIds(){
        return (this.user_ids ? this.user_ids.split("#").map(e=> parseInt(e)): []) as number[]
    }
    release(){
        return {
            id: this.id,
            user_ids: this.user_ids? this.user_ids.split("#") :[],
            avatar: this.avatar,
            created_time: this.created_time
        }
    }
}