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
const map_tag_1 = require("../../../models/map.tag/map.tag");
exports.default = (router) => {
    router.post("/blog.delete", (0, multer_1.default)({}).fields([]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user;
        if (!user) {
            return res.status(200).send(new BaseError_1.default("Please login!", BaseError_1.default.Code.ERROR).release());
        }
        let { id } = req.body;
        try {
            id = (0, helper_1.castToNumber)(id);
            if (!id) {
                return res.status(200).send(new BaseError_1.default("Id invalid!", BaseError_1.default.Code.ERROR).release());
            }
            if (!user.isHasBlog(id)) {
                return res.status(200).send(new BaseError_1.default("You don't have right!", BaseError_1.default.Code.ERROR).release());
            }
            const blog = yield blog_1.BlogModel.findByPk(id);
            if (!blog) {
                return res.status(200).send(new BaseError_1.default("Blog is not exist!", BaseError_1.default.Code.ERROR).release());
            }
            const tags = blog.tags ? JSON.parse(blog.tags) : [];
            if (tags.length) {
                yield map_tag_1.MapTagModal.destroy({
                    where: {
                        hash_key: tags.map(tag => map_tag_1.MapTagModal.setHashKey(tag, blog.status, user.id, blog.id))
                    }
                });
            }
            yield map_tag_1.MapTagModal.destroy({
                where: {
                    blog_id: blog.id
                }
            });
            yield blog.destroy();
            return res.status(200).send({
                code: BaseError_1.default.Code.SUCCESS
            });
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Emotional Damage!!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=blog.delete.js.map