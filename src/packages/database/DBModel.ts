import { Model } from 'sequelize-typescript';
import {Op} from 'sequelize';

export class DBModel extends Model {

    static async saveObject<M extends Model>(
        this: { new(): M } & typeof Model,
        params): Promise<M> {
        var value = await this.create(params);

        //@ts-ignore
        value.id = value.null;

        //@ts-ignore
        return value;
    }

    static async paginate<M extends Model>(this: { new(): M } & typeof Model, query: any, { page, page_size }): Promise<M[]> {
        var value = await this.findAll(
            {
                ...query,
                offset: (page - 1) * page_size,
                limit: page_size
            }
        );
        return value as M[];
    }


    static async findAllSafe<M extends Model>(this: { new(): M } & typeof Model, options: any): Promise<M[]>  {
        var where = options.where;
        var keys = Object.keys(where);
        for (var i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (!where[key].length) {
                return []
            } 

            if (where[key][Op.or] && !where[key][Op.or].length) {
                return []
            }
        }
        
        //@ts-ignore
        return this.findAll(options);
    }

    async saveObject(): Promise<this> {
        // @ts-ignore;
        return await DBModel.saveObject(this);
    }


    async edit(fields: string[]) {
        return await this.save({ fields: fields });
    }

}

