"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const get_1 = __importDefault(require("./get"));
const list_1 = __importDefault(require("./list"));
exports.default = (app) => {
    const route = (0, express_1.Router)();
    app.use("/chat", route);
    (0, get_1.default)(route);
    (0, list_1.default)(route);
};
//# sourceMappingURL=index.js.map