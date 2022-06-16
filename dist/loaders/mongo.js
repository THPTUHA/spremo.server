"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = () => {
    mongoose_1.default.connect('mongodb://localhost:27017/spremo', (err) => {
        if (err) {
            console.log("ERROR MONGO", err);
        }
        console.log("Connect mongodb");
    });
};
//# sourceMappingURL=mongo.js.map