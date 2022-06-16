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
const blog_1 = require("../../../models/blog/blog");
const like_1 = require("../../../models/core/like");
const Constants_1 = require("../../../Constants");
exports.default = (router) => {
    router.post("/like", (0, multer_1.default)({}).fields([]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user;
        if (!user) {
            return res.status(200).send(new BaseError_1.default("Please login!", BaseError_1.default.Code.ERROR).release());
        }
        const { emotion_id, id } = req.body;
        try {
            const blog = yield blog_1.BlogModel.findByPk(id);
            if (!blog) {
                return res.status(200).send(new BaseError_1.default("Blog not found!", BaseError_1.default.Code.ERROR).release());
            }
            const emotion = (0, helper_1.getEmotion)(emotion_id);
            if (!emotion) {
                return res.status(200).send(new BaseError_1.default("Emotion invalid!", BaseError_1.default.Code.ERROR).release());
            }
            let like = yield like_1.LikeModel.findOne({
                where: {
                    hash_key: like_1.LikeModel.createHashKey(blog.id, user.id)
                }
            });
            if (!like) {
                like = yield like_1.LikeModel.saveObject({
                    user_id: user.id,
                    since: (0, helper_1.time)(),
                    emotion_id: emotion_id,
                    blog_id: blog.id,
                    hash_key: like_1.LikeModel.createHashKey(blog.id, user.id)
                });
                blog.like_number += 1;
                yield blog.edit(["like_number"]);
                const owner = yield user_1.UserModel.findByPk(blog.user_id);
                if (owner.is(Constants_1.ROLES.DEVELOPER)) {
                    const day = (0, helper_1.getExactDayNow)();
                    yield user.updateRecord({
                        type: Constants_1.RECORD_TYPE.LIKE,
                        day: day,
                        value: 1
                    });
                }
                yield blog.onLike(like, user, [owner]);
            }
            else {
                yield like.destroy();
                blog.like_number -= 1;
                yield blog.edit(["like_number"]);
                const owner = yield user_1.UserModel.findByPk(blog.user_id);
                if (owner.is(Constants_1.ROLES.DEVELOPER)) {
                    const day = (0, helper_1.getExactDayNow)();
                    yield user.updateRecord({
                        type: Constants_1.RECORD_TYPE.LIKE,
                        day: day,
                        value: -1
                    });
                }
            }
            return res.status(200).send({
                code: BaseError_1.default.Code.SUCCESS
            });
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=like.js.map