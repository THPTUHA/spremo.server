import {Server} from "socket.io";
import jwtAuth  from 'socketio-jwt-auth';
import chat from "../api/routes/chat";
import ChatMG from "../models/chat/chatmg";
import { UserChatModel } from "../models/user.chat/user.chat";
import { UserModel } from "../models/user/user";
import { time, wrapSocket } from "../services/helper";

export default (server : any) => {
    const io = new Server(server,{
        cors: {
            origin: "*",
            methods: ["GET", "POST","HEAD"],
            credentials: true,
        },
    });

    io.use(jwtAuth.authenticate({
        secret: process.env.JWT_ENCODE_USER_KEY,    
      },async function(payload, done) {
        return done(null, payload.user);
    }));

    io.on('connection', wrapSocket(function(socket) {
        const {user} = socket.request;

        socket.join(user.id+'');
        socket.on('chat',async function(data) {
            data.chat.messages.push(data.message);
            await ChatMG.create({
                id: data.chat.id ,
                user_id: user.id,
                send_time: time(),
                message: data.message.content,
                status: 1
            })
            await UserChatModel.update({
                last_update: time(),
            },{
                where: {chat_id : data.chat.id}
            })
            io.sockets.in(data.chat.users.map(user => user.id+'')).emit("message",{
               chat: data.chat
           });
    
        })
    }));


};