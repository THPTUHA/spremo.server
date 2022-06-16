"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ban_blog_1 = __importDefault(require("./ban.blog"));
const ban_user_1 = __importDefault(require("./ban.user"));
const blog_list_1 = __importDefault(require("./blog.list"));
const pick_blog_1 = __importDefault(require("./pick.blog"));
const promote_user_1 = __importDefault(require("./promote.user"));
exports.default = (app) => {
    const route = (0, express_1.Router)();
    app.use("/admin", route);
    (0, ban_user_1.default)(route);
    (0, promote_user_1.default)(route);
    (0, pick_blog_1.default)(route);
    (0, ban_blog_1.default)(route);
    (0, blog_list_1.default)(route);
};
//# sourceMappingURL=index.js.map