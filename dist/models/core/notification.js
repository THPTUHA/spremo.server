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
exports.NotificationModel = void 0;
const DBModel_1 = require("../../packages/database/DBModel");
const sequelize_typescript_1 = require("sequelize-typescript");
let NotificationModel = class NotificationModel extends DBModel_1.DBModel {
    release() {
        return {
            id: this.id,
            object_id: this.object_id,
            object_type: this.object_type,
            from_id: this.from_id,
            user_id: this.user_id,
            content: this.content,
            since: this.since,
            action: this.action,
            status: this.status,
            link: this.link
        };
    }
    ;
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], NotificationModel.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], NotificationModel.prototype, "object_id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], NotificationModel.prototype, "object_type", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], NotificationModel.prototype, "user_id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], NotificationModel.prototype, "from_id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], NotificationModel.prototype, "since", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], NotificationModel.prototype, "content", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], NotificationModel.prototype, "link", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], NotificationModel.prototype, "action", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], NotificationModel.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], NotificationModel.prototype, "last_update", void 0);
NotificationModel = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Notifications',
        timestamps: false
    })
], NotificationModel);
exports.NotificationModel = NotificationModel;
//# sourceMappingURL=notification.js.map