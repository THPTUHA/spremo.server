import { Router } from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { firebase_db } from '../packages/firebase/firebase';
import BaseError from '../packages/base.error/BaseError';
import Chat from '../models/chat/chatmg';



export default (app: Router) => {
    const route = Router();
    app.use("/test",route);
    route.post("/test", multer({}).fields([]),async(req, res)=>{
        const {id, user_id, send_time,message,status} = req.body;
        console.log("BODY",req.body);
        try {
            const chat = await Chat.create({
                id: 1,
                user_id: 2,
                send_time: 12,
                message: "Hello Mongo",
                status: 1
            });

            console.log("CHAT",chat);
            return res.status(200).json(new BaseError("Register successful", BaseError.Code.SUCCESS));
        } catch (error) {
            console.log("ERROR",error);
            return res.status(200).json(new BaseError("EROROR", BaseError.Code.ERROR));
        }
    })
};