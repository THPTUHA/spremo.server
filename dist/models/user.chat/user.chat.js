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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserChatModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const DBModel_1 = require("../../packages/database/DBModel");
let UserChatModel = class UserChatModel extends DBModel_1.DBModel {
    static createHashKey({ user_id, chat_id }) {
        return user_id + "#" + chat_id;
    }
    release() {
        return {
            id: this.id,
            user_id: this.user_id,
            chat_id: this.chat_id,
            status: this.status,
            hash_key: this.hash_key,
            last_update: this.last_update
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserChatModel.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserChatModel.prototype, "user_id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserChatModel.prototype, "chat_id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserChatModel.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserChatModel.prototype, "hash_key", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserChatModel.prototype, "last_update", void 0);
UserChatModel = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'userChat',
        timestamps: false
    })
], UserChatModel);
exports.UserChatModel = UserChatModel;
//# sourceMappingURL=user.chat.js.map