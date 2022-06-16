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
const notification_1 = require("../../../models/core/notification");
exports.default = (router) => {
    router.post("/list", (0, multer_1.default)({}).fields([]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user;
        if (!user) {
            return res.status(200).send(new BaseError_1.default("Please login!", BaseError_1.default.Code.ERROR).release());
        }
        try {
            let { page, page_size } = req.body;
            page = (0, helper_1.castToNumber)(page) ? page : 1;
            page_size = (0, helper_1.castToNumber)(page_size) ? page_size : 5;
            const notifications = yield notification_1.NotificationModel.paginate({
                where: {
                    user_id: user.id
                },
                order: [
                    ['id', 'DESC']
                ]
            }, { page: page, page_size: 8 });
            for (let i = 0; i < notifications.length; ++i) {
                if (!notifications[i].status) {
                    notifications[i].status = 1;
                    yield notifications[i].edit(["status"]);
                }
            }
            const notification_number = yield notification_1.NotificationModel.count({
                where: {
                    user_id: user.id
                }
            });
            const user_ids = notifications.map((notifi) => notifi.from_id);
            const users = yield user_1.UserModel.findAll({
                where: { id: user_ids }
            });
            return res.status(200).send({
                notifications: notifications.map(e => e.release()),
                notification_number: notification_number,
                users: users.map(e => e.release()),
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