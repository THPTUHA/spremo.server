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
exports.TagModal = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const DBModel_1 = require("../../packages/database/DBModel");
let TagModal = class TagModal extends DBModel_1.DBModel {
    release() {
        return {
            id: this.id,
            name: this.name,
            user_id: this.user_id,
            created_time: this.created_time
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], TagModal.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TagModal.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], TagModal.prototype, "user_id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], TagModal.prototype, "created_time", void 0);
TagModal = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Tags',
        timestamps: false
    })
], TagModal);
exports.TagModal = TagModal;
//# sourceMappingURL=tag.js.map