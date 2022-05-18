import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { getExactDayNow, time, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { FollowModel } from '../../../models/core/follow';
import { RECORD_TYPE, ROLES } from '../../../Constants';

export default (router: Router) => {
    router.post("/unfollow",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const {user_id} = req.body;
                const user = req.user as UserModel;
                const user_follow = await UserModel.findByPk(user_id);
                if(!user_follow){
                    return res.status(200).send(new BaseError("User not found!", BaseError.Code.ERROR).release());
                }
                const follow = await  FollowModel.findOne({
                    where: { hash_key: FollowModel.createHashKey(user_follow.id, user.id)}
                })

                if(!follow){
                    return res.status(200).send(new BaseError("UnFollow!", BaseError.Code.ERROR).release());
                }

                follow.destroy();
                
                const my_following = user.getFollowing().filter(item => item.user_id != user_follow.id);
                const my_friend = user.getFriends().filter(item => item.user_id != user_follow.id);
                
                user.friends = JSON.stringify(my_friend);
                user.following = JSON.stringify(my_following);
                await user.edit(["following","friends"]);

                const friends = user_follow.getFriends().filter(item => item.user_id != user.id);
                user_follow.friends = JSON.stringify(friends);
                user_follow.follower_number -= 1;
                await user_follow.edit(["follower_number","friends"]);

                if(user_follow.is(ROLES.DEVELOPER)){
                    const day = getExactDayNow();
                    await user_follow.updateRecord({
                        type: RECORD_TYPE.FOLLOW,
                        day: day,
                        value: -1
                    }) 
                }
                
                return res.status(200).send({
                    code: BaseError.Code.SUCCESS
                });

            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};