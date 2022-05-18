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
                let follow_status = PUBLIC;
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
                
                const my_following = user.getFollowing();
                if(user_follow.is(ROLES.DEVELOPER)){
                    const day = getExactDayNow();
                    await user_follow.updateRecord({
                        type: RECORD_TYPE.FOLLOW,
                        day: day,
                        value: 1
                    }) 
                    my_following.push({
                        user_id: user_follow.id,
                        status: PUBLIC
                    })
                    user.following = JSON.stringify(my_following);
                    await user.edit(["following"]);

                }else{
                    const following = user_follow.getFollowing();
                    let check = -1;
                    for(let i = 0; i < following.length ;++i){
                        if(following[i].user_id == user.id){
                            check = i;
                            break;
                        }
                    }
                    if(check > -1){
                        const my_friends = user.getFriends();
                        const friends = user_follow.getFriends();

                        following[check] = {
                            user_id: user.id,
                            status: FRIEND
                        } 
                        my_following.push({
                            user_id: user_follow.id,
                            status: FRIEND
                        })

                        my_friends.push({
                            user_id: user_follow.id,
                            username: user_follow.username
                        });

                        friends.push({
                            user_id: user.id,
                            username: user.username
                        })
                        user.friends = JSON.stringify(my_friends);
                        user.following = JSON.stringify(my_following);

                        user_follow.friends = JSON.stringify(friends);
                        user_follow.following = JSON.stringify(following);
                        follow_status = FRIEND;
                        await user.edit(["friends","following"]);
                        await user_follow.edit(["friends","following"]);
                        await user.onFriend(follow, user, user_follow);

                    }else {
                        my_following.push({
                            user_id: user_follow.id,
                            status: PUBLIC
                        })
                        console.log("MY FOLLOWING", my_following);
                        user.following = JSON.stringify(my_following);
                        await user.edit(["following"]);
                    }
                }

                return res.status(200).send({
                    follow_status: follow_status,
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};