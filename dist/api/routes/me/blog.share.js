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
exports.default = (router) => {
    router.post("/blog.share", (0, multer_1.default)({}).fields([]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user;
        if (!user) {
            return res.status(200).send(new BaseError_1.default("Please login!", BaseError_1.default.Code.ERROR).release());
        }
        let { id, share_option_id, friend_ids } = req.body;
        try {
            id = (0, helper_1.castToNumber)(id);
            if (!id) {
                return res.status(200).send(new BaseError_1.default("Id invalid!", BaseError_1.default.Code.ERROR).release());
            }
            if (!user.isHasBlog(id)) {
                return res.status(200).send(new BaseError_1.default("You don't have right!", BaseError_1.default.Code.ERROR).release());
            }
            const status = (0, helper_1.castToNumber)(share_option_id);
            if (!(0, helper_1.isValidShareOption)(status)) {
                return res.status(200).send(new BaseError_1.default("Share invalid!", BaseError_1.default.Code.ERROR).release());
            }
            const blog = yield blog_1.BlogModel.findByPk(id);
            if (!blog) {
                return res.status(200).send(new BaseError_1.default("Blog is not exist!", BaseError_1.default.Code.ERROR).release());
            }
            if (blog.status == Constants_1.BAN) {
                return res.status(200).send(new BaseError_1.default("You can't share blog!", BaseError_1.default.Code.ERROR).release());
            }
            const emotion_name = blog.hash_key.split("#")[0];
            blog.user_views = status == Constants_1.FRIEND_SPECIFIC ? friend_ids : blog.user_views;
            blog.status = status;
            blog.hash_key = blog.editHashKeySync({ id: -1, name: emotion_name });
            yield blog.edit(["status", "hash_key", "user_views"]);
            const tags = blog.getTags();
            tags.push(emotion_name);
            yield (0, helper_1.updateManyTag)({
                tags: Array.from(new Set(tags)),
                user_id: user.id,
                blog: blog
            });
            return res.status(200).send({
                blog: blog.release(),
                code: BaseError_1.default.Code.SUCCESS
            });
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Emotional Damage!!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=blog.share.js.map