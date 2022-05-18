import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { castToNumber, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { NotificationModel } from '../../../models/core/notification';

export default (router: Router) => {
    router.post("/list",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            const user = req.user as UserModel;
            if(!user){
                return res.status(200).send(new BaseError("Please login!", BaseError.Code.ERROR).release());
            }
            try {
                let {page, page_size} = req.body;
                page = castToNumber(page)? page : 1;
                page_size = castToNumber(page_size)? page_size : 5;
                
                const notifications = await NotificationModel.paginate({
                    where: {
                        user_id: user.id
                    },
                    order: [
                        ['id', 'DESC']
                    ]
                }, { page: page, page_size: 8});

                for(let i = 0 ;i < notifications.length ;++i){
                    if(!notifications[i].status){
                        notifications[i].status = 1;
                        await notifications[i].edit(["status"]);
                    }
                }

                const notification_number = await NotificationModel.count({
                    where:{
                        user_id: user.id
                    }
                })
                const user_ids = notifications.map((notifi)=>notifi.from_id);

                const users = await UserModel.findAll({
                    where:{id: user_ids}
                });

                return res.status(200).send({
                    notifications: notifications.map(e=>e.release()),
                    notification_number: notification_number,
                    users: users.map(e=>e.release()),
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};