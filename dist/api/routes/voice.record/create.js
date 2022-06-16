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
const Constants_1 = require("../../../Constants");
const blog_1 = require("../../../models/blog/blog");
exports.default = (router) => {
    router.post("/create", (0, multer_1.default)({}).fields([]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { status, emotion_id, audio, title } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(200).send(new BaseError_1.default("Please login!", BaseError_1.default.Code.ERROR).release());
        }
        try {
            if (!status) {
                status = Constants_1.PRIVATE;
            }
            emotion_id = (0, helper_1.getEmotion)(emotion_id);
            console.log("STATUS", status, emotion_id);
            if (status != Constants_1.PRIVATE && !emotion_id) {
                return res.status(200).send(new BaseError_1.default("Blog must have emotion tag!", BaseError_1.default.Code.ERROR).release());
            }
            if (status == Constants_1.PRIVATE) {
                emotion_id = emotion_id ? emotion_id : 0;
            }
            if (!audio) {
                return res.status(200).send(new BaseError_1.default("Audio can not be empty!", -1).release());
            }
            if (!status)
                status = Constants_1.PRIVATE;
            const blog = yield blog_1.BlogModel.saveObject({
                user_id: user.id,
                data: JSON.stringify({
                    title: title,
                    url: audio
                }),
                type: Constants_1.BLOG_TYPES.AUDIO,
                last_update: (0, helper_1.time)(),
                created_time: (0, helper_1.time)(),
                status: status
            });
            yield blog.editHashKey(emotion_id);
            yield user.addBlog(blog.id, status);
            return res.status(200).send(new BaseError_1.default("Audio save successfull!", BaseError_1.default.Code.SUCCESS).release());
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=create.js.map