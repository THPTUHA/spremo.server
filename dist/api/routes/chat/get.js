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
const BaseError_1 = __importDefault(require("../../../packages/base.error/BaseError"));
const multer_1 = __importDefault(require("multer"));
const passport_1 = __importDefault(require("passport"));
const helper_1 = require("../../../services/helper");
const user_1 = require("../../../models/user/user");
const chat_1 = require("../../../models/chat/chat");
const chatmg_1 = __importDefault(require("../../../models/chat/chatmg"));
const user_chat_1 = require("../../../models/user.chat/user.chat");
exports.default = (router) => {
    router.post("/get", (0, multer_1.default)({}).fields([]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { user_id } = req.body;
            console.log("USER_ID-------------------", user_id);
            if (!user_id) {
                return res.status(200).send(new BaseError_1.default("Invalid!", BaseError_1.default.Code.ERROR).release());
            }
            const user = req.user;
            const user_chat = yield user_1.UserModel.findByPk(user_id);
            if (!user_chat || !user) {
                return res.status(200).send(new BaseError_1.default("Invalid!", BaseError_1.default.Code.ERROR).release());
            }
            const key = user.id > user_chat.id ? user_chat.id + "#" + user.id : user.id + "#" + user_chat.id;
            const chat = yield chat_1.ChatModel.findOne({
                where: {
                    user_ids: key
                }
            });
            if (!chat) {
                const chat = yield chat_1.ChatModel.saveObject({
                    user_ids: key,
                    created_time: (0, helper_1.time)(),
                });
                yield user_chat_1.UserChatModel.saveObject({
                    user_id: user.id,
                    chat_id: chat.id,
                    status: 1,
                    hash_key: user_chat_1.UserChatModel.createHashKey({ user_id: user.id, chat_id: chat.id }),
                    last_update: (0, helper_1.time)()
                });
                yield user_chat_1.UserChatModel.saveObject({
                    user_id: user_chat.id,
                    chat_id: chat.id,
                    status: 1,
                    hash_key: user_chat_1.UserChatModel.createHashKey({ user_id: user_chat.id, chat_id: chat.id }),
                    last_update: (0, helper_1.time)()
                });
                return res.status(200).send({
                    chat: chat.release(),
                    messages: [],
                    users: [user.release(), user_chat.release()],
                    code: BaseError_1.default.Code.SUCCESS
                });
            }
            const messages = yield chatmg_1.default.find({ id: chat.id });
            return res.status(200).send({
                chat: chat.release(),
                messages: messages,
                users: [user.release(), user_chat.release()],
                code: BaseError_1.default.Code.SUCCESS
            });
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=get.js.map