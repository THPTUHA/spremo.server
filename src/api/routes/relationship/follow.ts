import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { getExactDayNow, time, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { FollowModel } from '../../../models/core/follow';
import { FRIEND, RECORD_TYPE, ROLES ,PUBLIC} from '../../../Constants';

export default (router: Router) => {
    router.post("/follow",  
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

                let follow = await  FollowModel.findOne({
                    where: { hash_key: FollowModel.createHashKey(user_follow.id, user.id)}
                })

                if(follow){
                    return res.status(200).send(new BaseError("Followed!", BaseError.Code.ERROR).release());
                }

                follow = await FollowModel.saveObject({
                    user_id: user.id,
                    user_follow: user_follow.id,
                    since: time(),
                    hash_key: FollowModel.createHashKey(user_follow.id, user.id)
                })

                user_follow.follower_number += 1;
                await user_follow.edit(["follower_number"]);
                
                // const my_following = user.getFollowing();

                if(user_follow.is(ROLES.DEVELOPER)){
                    const day = getExactDayNow();

                    await user_follow.updateRecord({
                        type: RECORD_TYPE.FOLLOW,
                        day: day,
                        value: 1
                    }) 
                }else{
                    const following = user_follow.getFollowing();
                    if(following.includes(user.id)){
                        user.addFriend(user_follow.id);
                        user_follow.addFriend(user.id);

                        await user.edit(["friends"]);
                        await user_follow.edit(["friends"]);

                    }
                }

                user.addFollowing(user_follow.id);
                await user.edit(["following"]);

                return res.status(200).send({
                    is_follow: true,
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};