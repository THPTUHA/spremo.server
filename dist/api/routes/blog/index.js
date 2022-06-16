"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_list_1 = __importDefault(require("./auth.list"));
const comment_add_1 = __importDefault(require("./comment.add"));
const create_1 = __importDefault(require("./create"));
const detail_1 = __importDefault(require("./detail"));
const edit_1 = __importDefault(require("./edit"));
const get_1 = __importDefault(require("./get"));
const like_1 = __importDefault(require("./like"));
const list_1 = __importDefault(require("./list"));
const mark_1 = __importDefault(require("./mark"));
const profile_1 = __importDefault(require("./profile"));
exports.default = (app) => {
    const route = (0, express_1.Router)();
    app.use("/blog", route);
    (0, create_1.default)(route);
    (0, get_1.default)(route);
    (0, comment_add_1.default)(route);
    (0, like_1.default)(route);
    (0, list_1.default)(route);
    (0, profile_1.default)(route);
    (0, detail_1.default)(route);
    (0, edit_1.default)(route);
    (0, mark_1.default)(route);
    (0, auth_list_1.default)(route);
};
//# sourceMappingURL=index.js.map