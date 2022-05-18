import { Column, PrimaryKey, Table } from "sequelize-typescript";
import Crypto from "../../packages/crypto/crypto";
import { DBModel } from "../../packages/database/DBModel";


@Table({
    tableName: 'Tags',
    timestamps: false
})

export class TagModal extends DBModel{
    @PrimaryKey
    @Column
    id: number;
    @Column
    name: string;
    @Column
    user_id: number;
    @Column
    created_time: number;
    
    release(){
        return {
            id: this.id,
            name: this.name,
            user_id: this.user_id,
            created_time: this.created_time
        }
    }
}