"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = __importDefault(require("./routes/authentication"));
const me_1 = __importDefault(require("./routes/me"));
const test_1 = __importDefault(require("./test"));
const upload_1 = __importDefault(require("./routes/upload"));
const blog_1 = __importDefault(require("./routes/blog"));
const emotion_1 = __importDefault(require("./routes/emotion"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const chat_1 = __importDefault(require("./routes/chat"));
const relationship_1 = __importDefault(require("./routes/relationship"));
const search_1 = __importDefault(require("./routes/search"));
const user_1 = __importDefault(require("./routes/user"));
const admin_1 = __importDefault(require("./routes/admin"));
exports.default = () => {
    const app = (0, express_1.Router)();
    (0, authentication_1.default)(app);
    (0, me_1.default)(app);
    (0, test_1.default)(app);
    (0, blog_1.default)(app);
    (0, upload_1.default)(app);
    (0, emotion_1.default)(app);
    (0, notifications_1.default)(app);
    (0, chat_1.default)(app);
    (0, relationship_1.default)(app);
    (0, search_1.default)(app);
    (0, user_1.default)(app);
    (0, admin_1.default)(app);
    return app;
};
//# sourceMappingURL=index.js.map