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
exports.ChatModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const DBModel_1 = require("../../packages/database/DBModel");
let ChatModel = class ChatModel extends DBModel_1.DBModel {
    getUserIds() {
        return (this.user_ids ? this.user_ids.split("#").map(e => parseInt(e)) : []);
    }
    release() {
        return {
            id: this.id,
            user_ids: this.user_ids ? this.user_ids.split("#") : [],
            avatar: this.avatar,
            created_time: this.created_time
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ChatModel.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ChatModel.prototype, "user_ids", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ChatModel.prototype, "created_time", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ChatModel.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ChatModel.prototype, "avatar", void 0);
ChatModel = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Chats',
        timestamps: false
    })
], ChatModel);
exports.ChatModel = ChatModel;
//# sourceMappingURL=chat.js.map