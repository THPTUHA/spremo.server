import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { time, wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { ChatModel } from '../../../models/chat/chat';
import ChatMG from '../../../models/chat/chatmg';
import { UserChatModel } from '../../../models/user.chat/user.chat';

export default (router: Router) => {
    router.post("/get",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const {user_id} = req.body;
                console.log("USER_ID-------------------", user_id);
                if(!user_id){
                    return res.status(200).send(new BaseError("Invalid!", BaseError.Code.ERROR).release());
                }
                const user = req.user as UserModel;
                const user_chat = await UserModel.findByPk(user_id);
                if(!user_chat || !user){
                    return res.status(200).send(new BaseError("Invalid!", BaseError.Code.ERROR).release());
                }

                const key = user.id > user_chat.id ? user_chat.id + "#" + user.id : user.id + "#" +  user_chat.id;
                const chat = await ChatModel.findOne({
                    where:{
                        user_ids: key
                    }
                })   
                if(!chat){
                    const chat = await ChatModel.saveObject({
                        user_ids: key,
                        created_time: time(),
                    })

                    await UserChatModel.saveObject({
                        user_id: user.id,
                        chat_id: chat.id, 
                        status: 1,
                        hash_key: UserChatModel.createHashKey({user_id: user.id, chat_id: chat.id}),
                        last_update: time()
                    })
                    
                    await UserChatModel.saveObject({
                        user_id: user_chat.id,
                        chat_id: chat.id, 
                        status: 1,
                        hash_key: UserChatModel.createHashKey({user_id: user_chat.id, chat_id: chat.id}),
                        last_update: time()
                    })

                    return res.status(200).send({
                        chat: chat.release(),
                        messages:[],
                        users: [user.release(), user_chat.release()],
                        code: BaseError.Code.SUCCESS
                    });
                }    

                const messages = await ChatMG.find({id: chat.id});

                return res.status(200).send({
                    chat: chat.release(),
                    messages: messages,
                    users: [user.release(), user_chat.release()],
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};