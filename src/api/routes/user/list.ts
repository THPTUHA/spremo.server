import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { time, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import {Op} from 'sequelize';
import { BlogModel } from '../../../models/blog/blog';
import { FollowModel } from '../../../models/core/follow';
import { PUBLIC } from '../../../Constants';
import { Sequelize } from 'sequelize-typescript';

export default (router: Router) => {
    router.post("/list",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const {q,option} = req.body;
                let users = [];
                const user = req.user as UserModel;
                const recent_post_numbers = [];
                const following = user.getFollowing();
                
                if(option){
                    switch(option){
                        case 'top':
                            users = await UserModel.paginate({
                                order: [["follower_number","DESC"]]
                             },{page: 1, page_size: 5})
                             break;
                        case 'follow':
                            if(following.length){
                                users = await UserModel.paginate({
                                    where:{
                                        id: following
                                    }
                                 },{page: 1, page_size: 5})
                                
                                for(const user of users){
                                    const post_number = await BlogModel.count({
                                        where: {
                                            user_id: user.id,
                                            status: PUBLIC,
                                            last_update:{
                                                [Op.gt]: time() - 2 * 24 * 3600
                                            }
                                        }
                                    })
                                    recent_post_numbers.push({
                                        user_id: user.id,
                                        post_number: post_number
                                    })
                                }
                            }
                            break;
                        case 'recommended':
                            const following_include_me = [...following];
                            following_include_me.push(user.id);
                            users = await UserModel.paginate({
                                where:{
                                    id: {
                                        [Op.notIn]: following_include_me
                                    }
                                },
                                order: Sequelize.literal('rand()'),
                            },{page: 1, page_size: 5})
                            break;
                    }
                }else if(q){
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
                    following: user.getFollowing(),
                    friends: user.getFriends(),
                    recent_post_numbers: recent_post_numbers,
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