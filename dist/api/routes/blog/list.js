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
const sequelize_1 = require("sequelize");
const BaseError_1 = __importDefault(require("../../../packages/base.error/BaseError"));
const helper_1 = require("../../../services/helper");
const tag_1 = require("../../../models/tag/tag");
const map_tag_1 = require("../../../models/map.tag/map.tag");
const Constants_1 = require("../../../Constants");
const blog_1 = require("../../../models/blog/blog");
const user_1 = require("../../../models/user/user");
exports.default = (router) => {
    router.post("/list", (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { q, option, page, page_size } = req.body;
            const pagination = {
                page: (0, helper_1.castToNumber)(page),
                page_size: (0, helper_1.castToNumber)(page_size)
            };
            let mapTags = [];
            let blogs = [];
            console.log("OPTION--", option);
            if (option) {
                blogs = yield blog_1.BlogModel.findByOption({
                    option: option,
                    pagination: pagination
                });
            }
            if (q) {
                const tags = yield tag_1.TagModal.paginate({
                    where: {
                        name: {
                            [sequelize_1.Op.like]: `${q}%`
                        }
                    }
                }, { page: 1, page_size: 10 });
                const hash_keys = tags.map(tag => {
                    return {
                        hash_key: {
                            [sequelize_1.Op.like]: `${tag.name}#${Constants_1.PUBLIC}#%`
                        }
                    };
                });
                mapTags = yield map_tag_1.MapTagModal.paginate({
                    where: {
                        [sequelize_1.Op.or]: hash_keys,
                    },
                    order: [['id', 'DESC']]
                }, { page: 1, page_size: 10 });
                blogs = yield blog_1.BlogModel.findAll({
                    where: {
                        id: mapTags.map(tag => tag.blog_id)
                    }
                });
            }
            else if (!option) {
                blogs = yield blog_1.BlogModel.paginate({
                    where: {
                        status: Constants_1.PUBLIC
                    },
                    order: [["last_update", "DESC"]]
                }, { page: 1, page_size: 10 });
            }
            const users = yield user_1.UserModel.findAll({
                where: {
                    id: blogs.map(blog => blog.user_id)
                }
            });
            return res.status(200).send({
                blogs: blogs.map(blog => blog.release()),
                users: users.map(users => users.release()),
                likes: [],
                bookmarks: [],
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