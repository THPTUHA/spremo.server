"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signup_1 = __importDefault(require("./signup"));
const verify_1 = __importDefault(require("./verify"));
const signin_1 = __importDefault(require("./signin"));
const signout_1 = __importDefault(require("./signout"));
exports.default = (app) => {
    const route = (0, express_1.Router)();
    app.use("/authentication", route);
    (0, signup_1.default)(route);
    (0, verify_1.default)(route);
    (0, signin_1.default)(route);
    (0, signout_1.default)(route);
};
//# sourceMappingURL=index.js.map