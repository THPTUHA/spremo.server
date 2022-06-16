"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audio_1 = __importDefault(require("./audio"));
const img_1 = __importDefault(require("./img"));
exports.default = (app) => {
    const route = (0, express_1.Router)();
    app.use('/upload', route);
    (0, img_1.default)(route);
    (0, audio_1.default)(route);
};
//# sourceMappingURL=index.js.map