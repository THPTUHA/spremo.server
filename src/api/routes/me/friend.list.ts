import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import {Op} from 'sequelize';

export default (router: Router) => {
    router.post("/friend.list",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                let {q} = req.body;
                let users = [] as UserModel[];
                if(q){
                    const user = req.user as UserModel;
                    const friend_ids = user.getFriends();
                    q = q.toLowerCase();
                    
                    users = await UserModel.findAll({
                        where: {
                            id: friend_ids,
                            username:{
                                [Op.like]: `%${q}%`
                            }
                        }
                    })
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