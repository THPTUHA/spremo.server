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
const blog_1 = require("../../../models/blog/blog");
const Constants_1 = require("../../../Constants");
const notification_1 = require("../../../models/core/notification");
exports.default = (router) => {
    router.post("/blog.detail", (0, multer_1.default)({}).fields([]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            const user = (req.user);
            const blog = yield blog_1.BlogModel.findByPk(id);
            if (!blog || blog.user_id != user.id) {
                return res.status(200).send(new BaseError_1.default("Some error!", BaseError_1.default.Code.ERROR).release());
            }
            if (blog.status == Constants_1.BAN) {
                const notification = yield notification_1.NotificationModel.findByPk(blog.id);
                if (!notification) {
                    return res.status(200).send(new BaseError_1.default("Some error!", BaseError_1.default.Code.ERROR).release());
                }
                return res.status(200).send({
                    blog: blog.release(),
                    content: notification.content,
                    code: BaseError_1.default.Code.SUCCESS
                });
            }
            return res.status(200).send({
                blog: blog.release(),
                code: BaseError_1.default.Code.SUCCESS
            });
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=blog.detail.js.map