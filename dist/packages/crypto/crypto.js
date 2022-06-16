"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const md5_1 = __importDefault(require("md5"));
class Crypto {
    static hashUsernamePassword(username, password) {
        const buffer = Buffer.from((0, md5_1.default)(password) + username);
        return crypto_1.default.createHash('md5').update(buffer).digest('hex');
    }
}
exports.default = Crypto;
//# sourceMappingURL=crypto.js.map