"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hint_1 = __importDefault(require("./hint"));
exports.default = (app) => {
    const route = (0, express_1.Router)();
    app.use("/search", route);
    (0, hint_1.default)(route);
};
//# sourceMappingURL=index.js.map