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
exports.FollowModel = void 0;
const DBModel_1 = require("../../packages/database/DBModel");
const sequelize_typescript_1 = require("sequelize-typescript");
let FollowModel = class FollowModel extends DBModel_1.DBModel {
    static createHashKey(user_follow, user_id) {
        return user_follow + "#" + user_id;
    }
    release() {
        return {
            id: this.id,
            user_id: this.user_id,
            user_follow: this.user_follow,
            since: this.since,
            hash_key: this.hash_key
        };
    }
    ;
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], FollowModel.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], FollowModel.prototype, "user_id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], FollowModel.prototype, "user_follow", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], FollowModel.prototype, "since", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], FollowModel.prototype, "hash_key", void 0);
FollowModel = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'Follow',
        timestamps: false
    })
], FollowModel);
exports.FollowModel = FollowModel;
//# sourceMappingURL=follow.js.map