import { Column, PrimaryKey, Table } from "sequelize-typescript";
import Crypto from "../../packages/crypto/crypto";
import { DBModel } from "../../packages/database/DBModel";


@Table({
    tableName: 'MapTag',
    timestamps: false
})

export class MapTagModal extends DBModel{
    @PrimaryKey
    @Column
    id: number;
    @Column
    blog_id: number;
    @Column
    tag_id: number;
    @Column
    hash_key: string;
    
    static setHashKey(tag:string,share_option: number,user_id:number, blog_id: number){
        return tag+"#"+share_option+"#"+user_id+ "#"+blog_id;
    }

    release(){
        return {
            id: this.id,
            hash_key: this.hash_key,
            blog_id: this.blog_id,
            tag_id: this.tag_id
        }
    }
}