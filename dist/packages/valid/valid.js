"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../services/helper");
class Valid {
    static email(text) {
        var tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        if (!text)
            return false;
        if (text.length > 256)
            return false;
        if (!tester.test(text))
            return false;
        var textParts = text.split('@');
        var account = textParts[0];
        var address = textParts[1];
        if (account.length > 64)
            return false;
        var domainParts = address.split('.');
        if (domainParts.some(function (part) {
            return part.length > 63;
        }))
            return false;
        return true;
    }
    static string(value, max_length = 0) {
        if (!value) {
            return false;
        }
        if (value.length && max_length && value.length > max_length) {
            return false;
        }
        return !/^\s*$/.test(value);
    }
    static isNumber(value) {
        //@ts-ignore
        return parseInt(value) ? true : false;
    }
    static isUserName(value) {
        if ((0, helper_1.generateCode)(value) != value) {
            return false;
        }
        return true;
    }
}
exports.default = Valid;
//# sourceMappingURL=valid.js.map