import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { FollowModel } from '../../../models/core/follow';

export default (router: Router) => {
    router.post("/top",  
        multer({}).fields([]),
        wrapAsync(async(req, res)=>{
            try {
                const {user_id} = req.body;
                const users = await UserModel.paginate({
                   order: [["follower_number","DESC"]]
                },{page: 1, page_size: 10})

                const follows = await FollowModel.findAll({
                    where: {
                        hash_key: users.map(user => FollowModel.createHashKey(user.id, user_id))
                    }
                })
                return res.status(200).send({
                    follows: follows.map(follow => follow.release()),
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