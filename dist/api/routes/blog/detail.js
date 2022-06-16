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
const sequelize_1 = require("sequelize");
const helper_1 = require("../../../services/helper");
const blog_1 = require("../../../models/blog/blog");
const map_tag_1 = require("../../../models/map.tag/map.tag");
const Constants_1 = require("../../../Constants");
const user_1 = require("../../../models/user/user");
exports.default = (router) => {
    router.post("/detail", (0, multer_1.default)({}).fields([]), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { id, page, page_size } = req.body;
            page = (0, helper_1.castToNumber)(page) ? page : 1;
            page_size = (0, helper_1.castToNumber)(page_size) ? page_size : 10;
            const blog = yield blog_1.BlogModel.findByPk(id);
            if (!blog) {
                return res.status(200).send(new BaseError_1.default("Blog not found!", BaseError_1.default.Code.ERROR).release());
            }
            if (blog.status == Constants_1.BAN) {
                return res.status(200).send(new BaseError_1.default("You have no right!", BaseError_1.default.Code.ERROR).release());
            }
            let list_tag = blog.tags ? JSON.parse(blog.tags).map(tag => tag.toLowerCase()) : [];
            list_tag = Array.from(new Set(list_tag));
            const hash_keys = list_tag.map(tag => {
                return {
                    hash_key: {
                        [sequelize_1.Op.like]: `${tag.name}#${Constants_1.PUBLIC}#%`
                    }
                };
            });
            const mapTags = yield map_tag_1.MapTagModal.paginate({
                where: {
                    [sequelize_1.Op.or]: hash_keys,
                },
                order: [['id', 'DESC']]
            }, { page: 1, page_size: 10 });
            let blogs = yield blog_1.BlogModel.findAll({
                where: {
                    id: mapTags.filter(tag => tag.blog_id != blog.id).map(tag => tag.blog_id)
                }
            });
            const users = yield user_1.UserModel.findAll({
                where: {
                    id: blogs.map(blog => blog.user_id)
                }
            });
            return res.status(200).send({
                users: users.map(user => user.release()),
                blogs: blogs.map(blog => blog.release()),
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
//# sourceMappingURL=detail.js.map