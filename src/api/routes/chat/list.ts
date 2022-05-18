import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { UserChatModel } from '../../../models/user.chat/user.chat';
import { ChatModel} from '../../../models/chat/chat';
import {Op} from 'sequelize';
import ChatMG from '../../../models/chat/chatmg';

export default (router: Router) => {
    router.post("/list",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const user = req.user as UserModel;
                if(!user){
                    return res.status(200).send(new BaseError("Please Login!", BaseError.Code.ERROR).release());
                }
                const user_chats = await UserChatModel.paginate({
                    where:{
                        hash_key: {
                            [Op.like]: `${user.id}#%`
                        }
                    }
                },{page: 1, page_size: 10})


                const chats = await ChatModel.findAll({
                    where: {id: user_chats.map(chat => chat.chat_id)}
                })

                const ids = [];
                for(let i = 0 ;i < chats.length ; ++i){
                    const user_ids = chats[i].getUserIds();
                    ids.push(...user_ids);
                }
                
                const users = await UserModel.findAll({
                    where: {id: [...(new Set(ids))]}
                })

                const messages = [];
                for(let i = 0 ; i < chats.length; ++i){
                    const message = await ChatMG.find({id: chats[i].id}).limit(1).sort({send_time: -1});
                    messages.push(message);
                }

                return res.status(200).send({
                    users: users.map(user => user.release()),
                    chats: chats.map(chat => chat.release()),
                    messages: messages,
                    code: BaseError.Code.SUCCESS
                });

            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};