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
    router.post("/blog.create", (0, multer_1.default)({}).fields([]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user;
        if (!user) {
            return res.status(200).send(new BaseError_1.default("Please login!", BaseError_1.default.Code.ERROR).release());
        }
        let { data, status, type, url, title, audio, tags } = req.body;
        try {
            status = (0, helper_1.castToNumber)(status);
            if (!(0, helper_1.isValidStatus)(status)) {
                if (user.is(Constants_1.ROLES.DEVELOPER))
                    status = Constants_1.DRAFT;
                else
                    status = Constants_1.PRIVATE;
            }
            let list_tag = tags ? JSON.parse(tags).map(tag => tag.trim().toLowerCase()) : [];
            const emotion_ids = (0, helper_1.getEmotionIdFromTags)(list_tag);
            if (status != Constants_1.PRIVATE && !emotion_ids.length) {
                return res.status(200).send(new BaseError_1.default("Emotion tag empty!", BaseError_1.default.Code.ERROR).release());
            }
            type = (0, helper_1.castToNumber)(type);
            if (!(0, helper_1.isValidBlogType)(type)) {
                return res.status(200).send(new BaseError_1.default("Type invalid!", BaseError_1.default.Code.ERROR).release());
            }
            const object = {
                user_id: user.id,
                data: "",
                type: type,
                last_update: (0, helper_1.time)(),
                created_time: (0, helper_1.time)(),
                status: status,
                emotion_ids: blog_1.BlogModel.createEmotionId(emotion_ids),
                like_number: 0
            };
            switch (type) {
                case Constants_1.BLOG_TYPES.COMBINE:
                    object.data = data;
                    break;
                case Constants_1.BLOG_TYPES.DRAW:
                    object.data = JSON.stringify({
                        shapes: [{ key: 0 }],
                        url: Constants_1.DRAW_IMAGE
                    });
                    break;
                case Constants_1.BLOG_TYPES.AUDIO:
                    if (!audio) {
                        return res.status(200).send(new BaseError_1.default("", BaseError_1.default.Code.ERROR).release());
                    }
                    object.data = JSON.stringify({
                        title: title,
                        url: audio
                    });
                    break;
            }
            if (!object.data) {
                return res.status(200).send(new BaseError_1.default("Blog must have content!", BaseError_1.default.Code.ERROR).release());
            }
            const blog = yield blog_1.BlogModel.saveObject(object);
            yield blog.editHashKey();
            yield (0, helper_1.updateManyTag)({
                tags: list_tag,
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
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=blog.create.js.map