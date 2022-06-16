"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const create_1 = __importDefault(require("./create"));
exports.default = (app) => {
    const route = (0, express_1.Router)();
    app.use("/voice.record", route);
    (0, create_1.default)(route);
};
//# sourceMappingURL=index.js.map