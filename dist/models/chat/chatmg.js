"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    send_time: { type: Number, required: true },
    message: { type: String, required: true },
    status: { type: Number, required: true },
});
const ChatMG = (0, mongoose_1.model)('Chat', ChatSchema);
exports.default = ChatMG;
//# sourceMappingURL=chatmg.js.map