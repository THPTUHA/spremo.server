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
const sequelize_1 = require("sequelize");
const Constants_1 = require("../../../Constants");
const like_1 = require("../../../models/core/like");
const sequelize_typescript_1 = require("sequelize-typescript");
exports.default = (router) => {
    router.post("/blog.list", (0, multer_1.default)({}).fields([]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user;
        if (!user) {
            return res.status(200).send(new BaseError_1.default("Please login!", BaseError_1.default.Code.ERROR).release());
        }
        const { page, page_size, emotion_id, friend_position, following_position, friend_spe_position, id, option } = req.body;
        const pagination_personal = {
            friend_position: (0, helper_1.castToNumber)(friend_position),
            following_position: (0, helper_1.castToNumber)(following_position),
            friend_spe_position: (0, helper_1.castToNumber)(friend_spe_position)
        };
        let blogs = [];
        let likes = [];
        let users = [];
        try {
            if (option) {
                blogs = yield blog_1.BlogModel.findByOption({
                    option: option,
                    user: user,
                    pagination: {
                        page: page,
                        page_size: page_size
                    }
                });
            }
            if (emotion_id) {
                const emotion = (0, helper_1.getEmotion)(emotion_id);
                const current = (0, helper_1.time)() - 7 * 24 * 3600;
                const following = user.getFollowing();
                const friends = user.getFriends();
                const hash_key_following = following.map(follow => {
                    return {
                        [sequelize_1.Op.like]: `${follow}#${Constants_1.PUBLIC}#%`
                    };
                });
                const hash_key_friend = friends.map(friend => {
                    return {
                        [sequelize_1.Op.like]: `${friend}#${Constants_1.FRIEND}#%`
                    };
                });
                const hash_key_friend_specific = friends.map(friend => {
                    return {
                        [sequelize_1.Op.like]: `${friend}#${Constants_1.FRIEND_SPECIFIC}#%`
                    };
                });
                blogs = yield blog_1.BlogModel.findAll({
                    where: {
                        [sequelize_1.Op.or]: [
                            {
                                hash_key: {
                                    [sequelize_1.Op.or]: hash_key_following
                                },
                            },
                            {
                                hash_key: {
                                    [sequelize_1.Op.or]: hash_key_friend_specific
                                },
                                user_views: {
                                    [sequelize_1.Op.like]: `%#${user.id}#%`
                                }
                            },
                            {
                                hash_key: {
                                    [sequelize_1.Op.or]: hash_key_friend
                                },
                            }
                        ],
                        emoton_ids: {
                            [sequelize_1.Op.like]: `${emotion.id}#%`
                        }
                    },
                    order: sequelize_typescript_1.Sequelize.literal('rand()'),
                    limit: 5
                });
            }
            if (blogs.length) {
                likes = yield like_1.LikeModel.findAll({
                    where: { hash_key: blogs.map(blog => like_1.LikeModel.createHashKey(blog.id, user.id)) }
                });
                users = yield user_1.UserModel.findAll({
                    where: { id: blogs.map(blog => blog.user_id) }
                });
            }
            return res.status(200).send(Object.assign({ blogs: blogs.map((blog) => blog.release()), likes: likes.map((like) => like.release()), users: users.map((user) => user.release()), bookmarks: user ? user.getBookMarks() : [], code: BaseError_1.default.Code.SUCCESS }, pagination_personal));
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=blog.list.js.map