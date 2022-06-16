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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var UserModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Constants_1 = require("../../Constants");
const crypto_1 = __importDefault(require("../../packages/crypto/crypto"));
const DBModel_1 = require("../../packages/database/DBModel");
const notification_1 = require("../../services/notification/notification");
const blog_1 = require("../blog/blog");
const Record_1 = require("../record/Record");
let UserModel = UserModel_1 = class UserModel extends DBModel_1.DBModel {
    static checkCorrectPassword(username, check_password, password) {
        if (crypto_1.default.hashUsernamePassword(username, check_password) === password) {
            return true;
        }
        else {
            return false;
        }
    }
    isActiveAccount() {
        return this.active_status != UserModel_1.UNACTIVE && this.active_status != UserModel_1.BANNED;
    }
    getFollowing() {
        return (this.following ? this.following.split("#").filter(id => id).map(id => parseInt(id)) : []);
    }
    addFollowing(user_id) {
        this.following = (this.following ? this.following : "") + "#" + user_id + "#";
    }
    getFriends() {
        return (this.friends ? this.friends.split("#").filter(id => id).map(id => parseInt(id)) : []);
    }
    addFriend(user_id) {
        this.friends = (this.friends ? this.friends : "") + "#" + user_id + "#";
    }
    deleteFriend(user_id) {
        this.friends.replace("#" + user_id + "#", '');
    }
    deleteFollowing(user_id) {
        this.following.replace("#" + user_id + "#", '');
    }
    updateRecord({ type, day, value }) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield Record_1.RecordModel.findOne({
                where: {
                    since: day,
                    user_id: this.id
                }
            });
            let data = (this.data ? JSON.parse(this.data) : {});
            switch (type) {
                case Constants_1.RECORD_TYPE.COMMENT:
                    data = Object.assign(Object.assign({}, data), { comment_number: data.comment_number ? data.comment_number + value : (value > 0 ? 1 : 0) });
                    if (record) {
                        record.comment_number += value;
                        yield record.edit(["comment_number"]);
                    }
                    break;
                case Constants_1.RECORD_TYPE.BLOG:
                    data = Object.assign(Object.assign({}, data), { blog_number: data.blog_number ? data.blog_number + value : (value > 0 ? 1 : 0) });
                    if (record) {
                        record.blog_number += value;
                        yield record.edit(["blog_number"]);
                    }
                    break;
                case Constants_1.RECORD_TYPE.LIKE:
                    data = Object.assign(Object.assign({}, data), { like_number: data.like_number ? data.like_number + value : (value > 0 ? 1 : 0) });
                    if (record) {
                        record.like_number += value;
                        yield record.edit(["like_number"]);
                    }
                    break;
                case Constants_1.RECORD_TYPE.VIEW:
                    data = Object.assign(Object.assign({}, data), { view_number: data.view_number ? data.view_number + value : (value > 0 ? 1 : 0) });
                    if (record) {
                        record.view_number += value;
                        yield record.edit(["view_number"]);
                    }
                    break;
                case Constants_1.RECORD_TYPE.FOLLOW:
                    if (record) {
                        record.follow_number += value;
                        yield record.edit(["follow_number"]);
                    }
                    break;
            }
            if (!record) {
                yield Record_1.RecordModel.saveObject(Object.assign({ user_id: this.id, since: day, like_number: 0, view_number: 0, comment_number: 0, blog_number: 0, follow_number: 0 }, data));
            }
        });
    }
    getBookMarks() {
        return (this.bookmarks ? JSON.parse(this.bookmarks) : []);
    }
    editBookMarks({ blog_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = this.getBookMarks();
            if (ids.includes(blog_id)) {
                this.bookmarks = JSON.stringify(ids.filter(id => id != blog_id));
            }
            else {
                ids.push(blog_id);
                this.bookmarks = JSON.stringify(ids);
            }
            yield this.edit(["bookmarks"]);
        });
    }
    getBlogs({ page, page_size, status, user_view_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = {
                user_id: this.id
            };
            if (status) {
                q.status = status;
            }
            const blogs = yield blog_1.BlogModel.paginate({
                where: q,
                // order: [['id', 'DESC']]
                order: sequelize_typescript_1.Sequelize.literal('rand()'),
            }, { page, page_size });
            if (user_view_id) {
                return blogs.filter(blog => {
                    if (blog.status == Constants_1.FRIEND_SPECIFIC) {
                        return blog.getUserView().includes(user_view_id);
                    }
                    if (blog.status == Constants_1.FRIEND) {
                        return this.getFriends().includes(user_view_id);
                    }
                    if (blog.status == Constants_1.BAN || blog.status == Constants_1.PRIVATE) {
                        return false;
                    }
                    return true;
                });
            }
            return blogs;
        });
    }
    isHasBlog(blog_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blog_1.BlogModel.findOne({
                where: {
                    id: blog_id,
                    user_id: this.id,
                }
            });
        });
    }
    is(role) {
        return role == this.role;
    }
    onFriend(follow, user, user_follow) {
        return __awaiter(this, void 0, void 0, function* () {
            notification_1.NotificationService.init()
                .object({ id: follow.id, object_type: "friend" })
                .from(user)
                .setAction('be_friend')
                .setLink(``)
                .setContent(`<b>${user.username}</b> và <b>${user_follow.username}</b> đã trở thành bạn`)
                .setExcept([])
                .setReceivers([user, user_follow])
                .send();
        });
    }
    release() {
        return {
            id: this.id,
            username: this.username,
            avatar: this.avatar,
            background: this.background,
            emotion_id: this.emotion_id,
            data: this.data ? JSON.parse(this.data) : {},
            following: this.following ? JSON.parse(this.following) : [],
            follower_number: this.follower_number,
            friends: this.friends ? JSON.parse(this.friends) : [],
            role: this.role,
            bookmarks: this.bookmarks ? JSON.parse(this.bookmarks) : []
        };
    }
};
UserModel.BANNED = -2;
UserModel.UNACTIVE = -1;
UserModel.ACTIVED = 2;
UserModel.ACTIVE = 3;
UserModel.LOGIN = 4;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserModel.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserModel.prototype, "username", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserModel.prototype, "password", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserModel.prototype, "avatar", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserModel.prototype, "background", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserModel.prototype, "contact", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserModel.prototype, "sex", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserModel.prototype, "description", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserModel.prototype, "role", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserModel.prototype, "last_login", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserModel.prototype, "emotion_id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserModel.prototype, "chat_ids", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserModel.prototype, "last_update", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserModel.prototype, "active_status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserModel.prototype, "data", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserModel.prototype, "day_of_birth", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserModel.prototype, "emotion_last_update", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserModel.prototype, "follower_number", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserModel.prototype, "following", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserModel.prototype, "friends", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserModel.prototype, "bookmarks", void 0);
UserModel = UserModel_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Users',
        timestamps: false
    })
], UserModel);
exports.UserModel = UserModel;
//# sourceMappingURL=user.js.map