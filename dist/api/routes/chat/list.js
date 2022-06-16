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
const user_chat_1 = require("../../../models/user.chat/user.chat");
const chat_1 = require("../../../models/chat/chat");
const sequelize_1 = require("sequelize");
const chatmg_1 = __importDefault(require("../../../models/chat/chatmg"));
exports.default = (router) => {
    router.post("/list", (0, multer_1.default)({}).fields([]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = req.user;
            if (!user) {
                return res.status(200).send(new BaseError_1.default("Please Login!", BaseError_1.default.Code.ERROR).release());
            }
            const user_chats = yield user_chat_1.UserChatModel.paginate({
                where: {
                    hash_key: {
                        [sequelize_1.Op.like]: `${user.id}#%`
                    }
                }
            }, { page: 1, page_size: 10 });
            const chats = yield chat_1.ChatModel.findAll({
                where: { id: user_chats.map(chat => chat.chat_id) }
            });
            const ids = [];
            for (let i = 0; i < chats.length; ++i) {
                const user_ids = chats[i].getUserIds();
                ids.push(...user_ids);
            }
            const users = yield user_1.UserModel.findAll({
                where: { id: [...(new Set(ids))] }
            });
            const messages = [];
            for (let i = 0; i < chats.length; ++i) {
                const message = yield chatmg_1.default.find({ id: chats[i].id }).limit(1).sort({ send_time: -1 });
                messages.push(message);
            }
            return res.status(200).send({
                users: users.map(user => user.release()),
                chats: chats.map(chat => chat.release()),
                messages: messages,
                code: BaseError_1.default.Code.SUCCESS
            });
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=list.js.map