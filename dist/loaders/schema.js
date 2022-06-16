"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const blog_1 = require("../models/blog/blog");
const map_tag_1 = require("../models/map.tag/map.tag");
const tag_1 = require("../models/tag/tag");
const user_1 = require("../models/user/user");
const comment_1 = require("../models/comment/comment");
const notification_1 = require("../models/core/notification");
const chat_1 = require("../models/chat/chat");
const like_1 = require("../models/core/like");
const follow_1 = require("../models/core/follow");
const Record_1 = require("../models/record/Record");
const user_chat_1 = require("../models/user.chat/user.chat");
exports.default = () => {
    const sequelize = new sequelize_typescript_1.Sequelize({
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        dialect: 'mysql',
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        models: [
            user_1.UserModel,
            blog_1.BlogModel,
            tag_1.TagModal,
            map_tag_1.MapTagModal,
            comment_1.CommentModel,
            notification_1.NotificationModel,
            chat_1.ChatModel,
            like_1.LikeModel,
            follow_1.FollowModel,
            Record_1.RecordModel,
            user_chat_1.UserChatModel
        ]
    });
    return sequelize;
};
//# sourceMappingURL=schema.js.map