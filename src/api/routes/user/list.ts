import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import {Op} from 'sequelize';

export default (router: Router) => {
    router.post("/list",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const {q} = req.body;
                let users = [];
                if(q){
                    users = await UserModel.paginate({
                        where: {
                            username : {
                                [Op.like]: `${q}%`
                            }
                        },
                        order:[["id","DESC"]]
                    },{page: 1, page_size: 10})
                }else{
                    users = await UserModel.paginate({
                        order:[["id","DESC"]]
                    },{page: 1, page_size: 10})
                }
                return res.status(200).send({
                    users: users.map(user => user.release()),
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};