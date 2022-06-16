"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var BlogModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Constants_1 = require("../../Constants");
const DBModel_1 = require("../../packages/database/DBModel");
const helper_1 = require("../../services/helper");
const notification_1 = require("../../services/notification/notification");
const sequelize_1 = require("sequelize");
const map_tag_1 = require("../map.tag/map.tag");
let BlogModel = BlogModel_1 = class BlogModel extends DBModel_1.DBModel {
    editHashKey() {
        return __awaiter(this, void 0, void 0, function* () {
            this.hash_key = this.user_id + "#" + this.status + "#" + this.id;
            yield this.edit(["hash_key"]);
            return this.hash_key;
        });
    }
    editHashKeySync(emotion) {
        return emotion.name + "#" + this.status + "#" + this.user_id + "#" + this.id;
        ;
    }
    getTypeRaw() {
        const keys = Object.keys(Constants_1.BLOG_TYPES);
        for (const i in keys) {
            if (Constants_1.BLOG_TYPES[keys[i]] == this.type)
                return keys[i];
        }
        return "";
    }
    getUserView() {
        return (this.user_views ? JSON.parse(this.user_views) : []);
    }
    getTags() {
        return (this.tags ? JSON.parse(this.tags).map(tag => tag.toLowerCase()) : []);
    }
    getEmoionId() {
        return this.emotion_ids.split("#").filter(id => id);
    }
    static createEmotionId(emotion_ids) {
        return emotion_ids.map(id => "#" + id + "#").join('');
    }
    static findByOption({ option, user, pagination }) {
        return __awaiter(this, void 0, void 0, function* () {
            let blogs = [];
            switch (option) {
                case "bookmark":
                    if (user) {
                        blogs = yield BlogModel_1.findAll({
                            where: { id: user.getBookMarks() }
                        });
                    }
                    break;
                case 'picked':
                    blogs = yield BlogModel_1.paginate({
                        where: {
                            selected: Constants_1.SELECTED
                        },
                        order: [["selected_since", "DESC"]]
                    }, pagination);
                    break;
                case 'banned':
                    blogs = yield BlogModel_1.paginate({
                        where: {
                            status: Constants_1.BAN
                        },
                        order: [["id", "DESC"]]
                    }, pagination);
                    break;
                case 'trending':
                    blogs = yield BlogModel_1.paginate({
                        where: {
                            status: Constants_1.PUBLIC
                        },
                        order: [["like_number", "DESC"]]
                    }, pagination);
                    break;
                case 'staff-picks':
                    blogs = yield BlogModel_1.paginate({
                        where: {
                            selected: Constants_1.SELECTED,
                            status: Constants_1.PUBLIC
                        },
                        order: [["selected_since", "DESC"]]
                    }, pagination);
                    break;
                case 'my-blog':
                    if (user) {
                        blogs = yield user.getBlogs(Object.assign({}, pagination));
                    }
                    break;
                case 'my-blog-banned':
                    if (user) {
                        blogs = yield user.getBlogs(Object.assign(Object.assign({}, pagination), { status: [Constants_1.BAN] }));
                    }
            }
            return blogs;
        });
    }
    static get({ option, postion, searchs, emotion, page, current, user_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            postion = (0, helper_1.castToNumber)(postion);
            if (postion != NaN && postion < -1) {
                return {
                    blogs: [],
                    postion: -2
                };
            }
            postion = (postion != NaN && postion >= 0) ? postion : searchs.length - 1;
            let ids = [];
            let blogs = [];
            let blogs_temp = [];
            for (let i = postion; i >= 0; --i) {
                ids.push(searchs[i].user_id);
                postion--;
                if (ids.length >= page) {
                    const query = ids.map(id => {
                        return {
                            [sequelize_1.Op.like]: `${emotion}#${option}#${id}#%`
                        };
                    });
                    const map_tags = yield map_tag_1.MapTagModal.findAll({
                        where: {
                            hash_key: {
                                [sequelize_1.Op.or]: query
                            }
                        }
                    });
                    if (map_tags.length) {
                        blogs_temp = yield BlogModel_1.findAll({
                            where: {
                                id: map_tags.map(tag => tag.blog_id)
                            }
                        });
                    }
                    if (option == Constants_1.FRIEND_SPECIFIC) {
                        for (let j = 0; j < blogs_temp.length; ++j) {
                            const user_views = blogs_temp[j].getUserView();
                            if (user_views.includes(user_id)) {
                                blogs.push(blogs_temp[j]);
                            }
                        }
                    }
                    else {
                        for (let j = 0; j < blogs_temp.length; ++j) {
                            blogs.push(blogs_temp[j]);
                        }
                    }
                    console.log("BLOG.....", blogs);
                    ids = [];
                    if (blogs.length >= 6)
                        break;
                    blogs_temp = [];
                }
            }
            if (ids.length) {
                const query = ids.map(id => {
                    return {
                        [sequelize_1.Op.like]: `${emotion}#${option}#${id}#%`
                    };
                });
                console.log("QUERY---", option, query);
                const map_tags = yield map_tag_1.MapTagModal.findAll({
                    where: {
                        hash_key: {
                            [sequelize_1.Op.or]: query
                        }
                    }
                });
                let blogs_temp = yield BlogModel_1.findAll({
                    where: {
                        id: map_tags.map(tag => tag.blog_id)
                    }
                });
                if (option == Constants_1.FRIEND_SPECIFIC) {
                    for (let j = 0; j < blogs_temp.length; ++j) {
                        const user_views = blogs_temp[j].user_views ? JSON.parse(blogs_temp[j].user_views) : [];
                        if (user_views.includes(user_id)) {
                            blogs.push(blogs_temp[j]);
                        }
                    }
                }
                else {
                    for (let j = 0; j < blogs_temp.length; ++j) {
                        blogs.push(blogs_temp[j]);
                    }
                }
            }
            return {
                blogs: blogs,
                postion: postion == -1 ? -2 : postion
            };
        });
    }
    onComment(comment, user, user_revicers) {
        return __awaiter(this, void 0, void 0, function* () {
            notification_1.NotificationService.init()
                .object(comment)
                .from(user)
                .setAction('comment_blog')
                .setLink(`/blogs/${this.id}`)
                .setContent(`<b>${user.username}</b> đã bình luận vào blog của bạn`)
                .setExcept([user])
                .setReceivers(user_revicers)
                .send();
        });
    }
    onLike(like, user, user_revicers) {
        return __awaiter(this, void 0, void 0, function* () {
            notification_1.NotificationService.init()
                .object({ id: like.id, object_type: "like" })
                .from(user)
                .setAction('like_blog')
                .setLink(`/blogs/${this.id}`)
                .setContent(`<b>${user.username}</b> đã bày tỏ cảm xúc với blog của bạn`)
                .setExcept([user])
                .setReceivers(user_revicers)
                .send();
        });
    }
    onBan(blog, user, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            notification_1.NotificationService.init()
                .object(blog)
                .from(user)
                .setAction('ban_blog')
                .setLink(`/blog/banned/${user.username}/${blog.id}`)
                .setContent(`Blog của bạn đã bị ban do ${reason}`)
                .setExcept([])
                .setReceivers([user])
                .send();
        });
    }
    release() {
        return {
            id: this.id,
            user_id: this.user_id,
            data: this.data ? JSON.parse(this.data) : {},
            hash_key: this.hash_key,
            last_update: this.last_update,
            type: this.type,
            tags: this.tags ? JSON.parse(this.tags) : [],
            status: this.status,
            created_time: this.created_time,
            like_number: this.like_number,
            comment_number: this.comment_number,
            selected: this.selected,
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], BlogModel.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], BlogModel.prototype, "user_id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], BlogModel.prototype, "data", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], BlogModel.prototype, "last_update", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], BlogModel.prototype, "hash_key", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], BlogModel.prototype, "created_time", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], BlogModel.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], BlogModel.prototype, "type", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], BlogModel.prototype, "tags", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], BlogModel.prototype, "like_number", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], BlogModel.prototype, "comment_number", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], BlogModel.prototype, "user_views", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], BlogModel.prototype, "selected", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], BlogModel.prototype, "selected_since", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], BlogModel.prototype, "emotion_ids", void 0);
BlogModel = BlogModel_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Blogs',
        timestamps: false
    })
], BlogModel);
exports.BlogModel = BlogModel;
//# sourceMappingURL=blog.js.map