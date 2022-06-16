"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const update_1 = __importDefault(require("./update"));
exports.default = (app) => {
    const route = (0, express_1.Router)();
    app.use("/draw", route);
    (0, update_1.default)(route);
};
//# sourceMappingURL=index.js.map