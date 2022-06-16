"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const follow_1 = __importDefault(require("./follow"));
const unfollow_1 = __importDefault(require("./unfollow"));
exports.default = (app) => {
    const route = (0, express_1.Router)();
    app.use("/relationship", route);
    (0, follow_1.default)(route);
    (0, unfollow_1.default)(route);
};
//# sourceMappingURL=index.js.map