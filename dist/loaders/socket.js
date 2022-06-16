"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const socketio_jwt_auth_1 = __importDefault(require("socketio-jwt-auth"));
const chatmg_1 = __importDefault(require("../models/chat/chatmg"));
const user_chat_1 = require("../models/user.chat/user.chat");
const helper_1 = require("../services/helper");
exports.default = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "HEAD"],
            credentials: true,
        },
    });
    io.use(socketio_jwt_auth_1.default.authenticate({
        secret: process.env.JWT_ENCODE_USER_KEY,
    }, function (payload, done) {
        return __awaiter(this, void 0, void 0, function* () {
            return done(null, payload.user);
        });
    }));
    io.on('connection', (0, helper_1.wrapSocket)(function (socket) {
        const { user } = socket.request;
        socket.join(user.id + '');
        socket.on('chat', function (data) {
            return __awaiter(this, void 0, void 0, function* () {
                data.chat.messages.push(data.message);
                yield chatmg_1.default.create({
                    id: data.chat.id,
                    user_id: user.id,
                    send_time: (0, helper_1.time)(),
                    message: data.message.content,
                    status: 1
                });
                yield user_chat_1.UserChatModel.update({
                    last_update: (0, helper_1.time)(),
                }, {
                    where: { chat_id: data.chat.id }
                });
                io.sockets.in(data.chat.users.map(user => user.id + '')).emit("message", {
                    chat: data.chat
                });
            });
        });
    }));
};
//# sourceMappingURL=socket.js.map