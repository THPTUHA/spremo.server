import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { TagModal } from '../../../models/tag/tag';
import {Op} from 'sequelize';
import { UserModel } from '../../../models/user/user';

export default (router: Router) => {
    router.post("/hint",  
        multer({}).fields([]),
        wrapAsync(async(req, res)=>{
            try {
                const {q} = req.body;
                if(!q){
                    return res.status(200).send(new BaseError("", BaseError.Code.ERROR).release());
                }

                const tags = await TagModal.paginate({
                    where: {
                        name : {
                            [Op.like]: `${q}%`
                        }
                    }
                },{page: 1, page_size: 10})

                const users = await UserModel.paginate({
                    where: {
                        username : {
                            [Op.like]: `${q}%`
                        }
                    }
                },{page: 1, page_size: 10})

                return res.status(200).send({
                    tags: tags.map(tag => tag.name),
                    users: users.map(users=>users.release()),
                    code: BaseError.Code.SUCCESS
                });

            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};