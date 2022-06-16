"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const BaseError_1 = __importDefault(require("../packages/base.error/BaseError"));
const chatmg_1 = __importDefault(require("../models/chat/chatmg"));
exports.default = (app) => {
    const route = (0, express_1.Router)();
    app.use("/test", route);
    route.post("/test", (0, multer_1.default)({}).fields([]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, user_id, send_time, message, status } = req.body;
        console.log("BODY", req.body);
        try {
            const chat = yield chatmg_1.default.create({
                id: 1,
                user_id: 2,
                send_time: 12,
                message: "Hello Mongo",
                status: 1
            });
            console.log("CHAT", chat);
            return res.status(200).json(new BaseError_1.default("Register successful", BaseError_1.default.Code.SUCCESS));
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).json(new BaseError_1.default("EROROR", BaseError_1.default.Code.ERROR));
        }
    }));
};
//# sourceMappingURL=test.js.map