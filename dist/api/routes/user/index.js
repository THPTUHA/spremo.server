"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const censor_1 = __importDefault(require("./censor"));
const list_1 = __importDefault(require("./list"));
const top_1 = __importDefault(require("./top"));
exports.default = (app) => {
    const route = (0, express_1.Router)();
    app.use('/user', route);
    (0, top_1.default)(route);
    (0, list_1.default)(route);
    (0, censor_1.default)(route);
};
//# sourceMappingURL=index.js.map