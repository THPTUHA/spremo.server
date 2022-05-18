import { throws } from "assert";
import { Column, PrimaryKey, Table } from "sequelize-typescript";
import Crypto from "../../packages/crypto/crypto";
import { DBModel } from "../../packages/database/DBModel";


@Table({
    tableName: 'userChat',
    timestamps: false
})

export class UserChatModel extends DBModel{
    @PrimaryKey
    @Column
    id: number;
    @Column
    user_id:number;
    @Column
    chat_id:number;
    @Column
    status:number;
    @Column
    hash_key: string;
    @Column
    last_update:number;
    
    static createHashKey({user_id, chat_id}:{user_id: number, chat_id: number}){
        return user_id + "#" + chat_id;
    }

    release(){
        return {
            id: this.id,
            user_id: this.user_id,
            chat_id: this.chat_id,
            status: this.status,
            hash_key: this.hash_key,
            last_update: this.last_update
        }
    }
}