import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';

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
                    const friends = user.getFriends();
                    q = q.toLowerCase();
                    const friend_ids = [];
                    for(let i = 0 ; i < friends.length ; ++i){
                        if(q.length <=  friends[i].username.length 
                            && q == friends[i].username.toLowerCase().substring(0,q.length)){
                                friend_ids.push(friends[i].user_id)
                            }
                    }
                    users = await UserModel.findAll({
                        where: {
                            id: friend_ids
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