import { Column, PrimaryKey, Table } from "sequelize-typescript";
import Crypto from "../../packages/crypto/crypto";
import { DBModel } from "../../packages/database/DBModel";


@Table({
    tableName: 'Comments',
    timestamps: false
})

export class CommentModel extends DBModel{
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
    since: number;
    @Column
    content: string;
    @Column
    last_update: number
    
    release(){
        return {
            id: this.id,
            object_id: this.object_id,
            object_type: this.object_type,
            user_id: this.user_id,
            since: this.since,
            content: this.content,
            last_update: this.last_update
        }
    }
}