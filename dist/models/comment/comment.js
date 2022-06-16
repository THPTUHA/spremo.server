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
exports.CommentModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const DBModel_1 = require("../../packages/database/DBModel");
let CommentModel = class CommentModel extends DBModel_1.DBModel {
    release() {
        return {
            id: this.id,
            object_id: this.object_id,
            object_type: this.object_type,
            user_id: this.user_id,
            since: this.since,
            content: this.content,
            last_update: this.last_update
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CommentModel.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CommentModel.prototype, "object_id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CommentModel.prototype, "object_type", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CommentModel.prototype, "user_id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CommentModel.prototype, "since", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CommentModel.prototype, "content", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CommentModel.prototype, "last_update", void 0);
CommentModel = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Comments',
        timestamps: false
    })
], CommentModel);
exports.CommentModel = CommentModel;
//# sourceMappingURL=comment.js.map