"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseError {
    constructor(message, code) {
        this.message = message;
        this.code = code;
    }
    release() {
        return {
            message: this.message,
            code: this.code
        };
    }
}
exports.default = BaseError;
BaseError.Code = {
    ERROR: -1,
    SUCCESS: 1,
    INVALID_PASSWORD: 2,
    INACTIVATE_AUTH: 3,
    NOTFOUND: 4,
    INVALID_AUTH: 5,
    INVALID_INPUT: 6
};
//# sourceMappingURL=BaseError.js.map