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
exports.RecordModel = void 0;
const DBModel_1 = require("../../packages/database/DBModel");
const sequelize_typescript_1 = require("sequelize-typescript");
let RecordModel = class RecordModel extends DBModel_1.DBModel {
    release() {
        return {
            id: this.id,
            user_id: this.user_id,
            since: this.since,
            like_number: this.like_number,
            view_number: this.view_number,
            comment_number: this.comment_number,
            blog_number: this.blog_number,
            follow_number: this.follow_number
        };
    }
    ;
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], RecordModel.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], RecordModel.prototype, "user_id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], RecordModel.prototype, "since", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], RecordModel.prototype, "like_number", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], RecordModel.prototype, "comment_number", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], RecordModel.prototype, "view_number", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], RecordModel.prototype, "blog_number", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], RecordModel.prototype, "follow_number", void 0);
RecordModel = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Records',
        timestamps: false
    })
], RecordModel);
exports.RecordModel = RecordModel;
//# sourceMappingURL=Record.js.map