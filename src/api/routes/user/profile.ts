import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { FollowModel } from '../../../models/core/follow';
import { FRIEND, FRIEND_SPECIFIC, PUBLIC } from '../../../Constants';

export default (router: Router) => {
    router.post("/profile",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                let {username, page, page_size} = req.body;

                const user = req.user as UserModel;
                const user_follow = await UserModel.findOne({
                    where: {username: username}
                })

                if(!user_follow){
                    return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
                }
                
                const is_follow = user.isFollowing(user_follow.id);
                const is_friend = user.isFriend(user_follow.id);

                const status = [PUBLIC];

                if(is_friend){
                    status.push(FRIEND);
                    status.push(FRIEND_SPECIFIC);
                }
                
                return res.status(200).send({
                    is_follow: is_follow,
                    is_friend: is_friend,
                    user: user_follow.release(),
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};