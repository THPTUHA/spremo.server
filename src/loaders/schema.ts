import { Sequelize } from 'sequelize-typescript';
import { BlogModel } from '../models/blog/blog';
import { MapTagModal } from '../models/map.tag/map.tag';
import { TagModal } from '../models/tag/tag';
import { UserModel } from "../models/user/user";
import { CommentModel } from '../models/comment/comment';
import { NotificationModel } from '../models/core/notification';
import { ChatModel } from '../models/chat/chat';
import { LikeModel } from '../models/core/like';
import { FollowModel } from '../models/core/follow';
import { RecordModel } from '../models/record/Record';
import { UserChatModel } from '../models/user.chat/user.chat';
import { SettingModel } from '../models/core/setting';

export default () => {
    const sequelize = new Sequelize({
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        dialect: 'mysql',
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        models: [
            UserModel,
            BlogModel,
            TagModal,
            MapTagModal,
            CommentModel,
            NotificationModel,
            ChatModel,
            LikeModel,
            FollowModel,
            RecordModel,
            UserChatModel,
            SettingModel
        ]
    });
    return sequelize;
};