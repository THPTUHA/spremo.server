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
exports.default = (router) => {
    router.post("/friend.list", (0, multer_1.default)({}).fields([]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { q } = req.body;
            let users = [];
            if (q) {
                const user = req.user;
                const friends = user.getFriends();
                q = q.toLowerCase();
                const friend_ids = [];
                for (let i = 0; i < friends.length; ++i) {
                    if (q.length <= friends[i].username.length
                        && q == friends[i].username.toLowerCase().substring(0, q.length)) {
                        friend_ids.push(friends[i].user_id);
                    }
                }
                users = yield user_1.UserModel.findAll({
                    where: {
                        id: friend_ids
                    }
                });
            }
            return res.status(200).send({
                users: users.map(user => user.release()),
                code: BaseError_1.default.Code.SUCCESS
            });
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=friend.list.js.map