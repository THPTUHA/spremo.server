"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_get_1 = __importDefault(require("./blog.get"));
const profile_1 = __importDefault(require("./profile"));
const blog_list_1 = __importDefault(require("./blog.list"));
const blog_update_1 = __importDefault(require("./blog.update"));
const blog_create_1 = __importDefault(require("./blog.create"));
const blog_delete_1 = __importDefault(require("./blog.delete"));
const blog_share_1 = __importDefault(require("./blog.share"));
const appearance_edit_1 = __importDefault(require("./appearance.edit"));
const record_1 = __importDefault(require("./record"));
const friend_list_1 = __importDefault(require("./friend.list"));
exports.default = (app) => {
    const route = (0, express_1.Router)();
    app.use("/me", route);
    (0, profile_1.default)(route);
    (0, blog_get_1.default)(route);
    (0, blog_list_1.default)(route);
    (0, blog_update_1.default)(route);
    (0, blog_create_1.default)(route);
    (0, blog_delete_1.default)(route);
    (0, blog_share_1.default)(route);
    (0, appearance_edit_1.default)(route);
    (0, record_1.default)(route);
    (0, friend_list_1.default)(route);
};
//# sourceMappingURL=index.js.map