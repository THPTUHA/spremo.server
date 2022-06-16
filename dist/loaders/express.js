"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("../api"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
exports.default = ({ app }) => {
    console.log("load;ing");
    app.use((0, cors_1.default)({
        'origin': '*',
        'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }));
    app.use((0, morgan_1.default)('combined'));
    app.use(body_parser_1.default.urlencoded({ extended: false }));
    app.use(body_parser_1.default.json());
    app.use((0, express_session_1.default)({
        secret: 'gagoda_secret',
        resave: false,
        saveUninitialized: false
    }));
    app.use('/api', (0, api_1.default)());
};
//# sourceMappingURL=express.js.map