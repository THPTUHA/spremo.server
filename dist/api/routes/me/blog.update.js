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
    router.post("/blog.update", (0, multer_1.default)({}).fields([]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user;
        if (!user) {
            return res.status(200).send(new BaseError_1.default("Please login!", BaseError_1.default.Code.ERROR).release());
        }
        let { data, status, id, url, title, audio, tags } = req.body;
        try {
            id = (0, helper_1.castToNumber)(id);
            if (!id) {
                return res.status(200).send(new BaseError_1.default("Id invalid!", BaseError_1.default.Code.ERROR).release());
            }
            const blog = yield blog_1.BlogModel.findByPk(id);
            if (!blog) {
                return res.status(200).send(new BaseError_1.default("Blog not found!", BaseError_1.default.Code.ERROR).release());
            }
            if (blog.status == Constants_1.BAN) {
                return res.status(200).send(new BaseError_1.default("You can't update blog!", BaseError_1.default.Code.ERROR).release());
            }
            if (blog.user_id != user.id) {
                console.log("OK");
                if (blog.type != Constants_1.BLOG_TYPES.DRAW)
                    return res.status(200).send(new BaseError_1.default("You have no right!", BaseError_1.default.Code.ERROR).release());
                console.log("OCONTINUE_____");
                const blog_new = yield blog_1.BlogModel.saveObject({
                    user_id: user.id,
                    data: blog.data = JSON.stringify({
                        shapes: JSON.parse(data),
                        url: url
                    }),
                    type: blog.type,
                    last_update: (0, helper_1.time)(),
                    created_time: (0, helper_1.time)(),
                    status: blog.status,
                    like_number: 0
                });
                yield blog_new.editHashKey();
                return res.status(200).send(new BaseError_1.default("Save successfull!", BaseError_1.default.Code.SUCCESS).release());
            }
            status = (0, helper_1.castToNumber)(status);
            if (!(0, helper_1.isValidStatus)(status)) {
                status = blog.status;
            }
            blog.last_update = (0, helper_1.time)();
            let list_tag = tags ? JSON.parse(tags).map(tag => tag.trim().toLowerCase()) : [];
            const tags_temp = [];
            for (let tag_init of list_tag) {
                if (tag_init) {
                    tags_temp.push(tag_init);
                    const tags = tag_init.split(/\s+/);
                    for (let tag of tags) {
                        if (tag)
                            tags_temp.push(tag);
                    }
                }
            }
            list_tag = Array.from(new Set(tags_temp));
            if (!tags) {
                tags = blog.tags;
            }
            blog.tags = tags;
            blog.status = status;
            const emotion_ids = (0, helper_1.getEmotionIdFromTags)(list_tag);
            if (status != Constants_1.PRIVATE && !emotion_ids.length) {
                return res.status(200).send(new BaseError_1.default("Emotion tag empty!", BaseError_1.default.Code.ERROR).release());
            }
            if (data) {
                switch (blog.type) {
                    case Constants_1.BLOG_TYPES.COMBINE:
                        blog.data = data;
                        break;
                    case Constants_1.BLOG_TYPES.DRAW:
                        blog.data = JSON.stringify({
                            shapes: JSON.parse(data),
                            url: url
                        });
                        break;
                    case Constants_1.BLOG_TYPES.AUDIO:
                        if (audio) {
                            const data = {
                                url: audio
                            };
                            if (title) {
                                data.title = title;
                            }
                            const data_init = JSON.parse(blog.data);
                            blog.data = JSON.stringify(Object.assign(Object.assign({}, data_init), data));
                        }
                        break;
                }
            }
            yield blog.edit(["last_update", "status", "data", "tags", "emotion_ids"]);
            yield (0, helper_1.updateManyTag)({
                tags: list_tag,
                user_id: user.id,
                blog: blog
            });
            if (blog.status != Constants_1.PUBLIC) {
                blog.selected = 0;
                yield blog.edit(["selected"]);
            }
            return res.status(200).send(new BaseError_1.default("Save successfull!", BaseError_1.default.Code.SUCCESS).release());
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=blog.update.js.map