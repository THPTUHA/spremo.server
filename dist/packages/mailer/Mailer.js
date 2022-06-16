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
const nodemailer_1 = __importDefault(require("nodemailer"));
const helper_1 = require("../../services/helper");
class Mailer {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.instance = nodemailer_1.default.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: process.env.GMAIL_USERNAME,
                    pass: process.env.GMAIL_PASSWORD,
                },
            });
        });
    }
    static sendMail(receivers, content, title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield this.instance.sendMail({
                    from: process.env.GMAIL_MAIL,
                    to: receivers.join(","),
                    subject: title,
                    html: content
                });
                return message;
            }
            catch (e) {
                console.log("ERORR", e);
                return "";
            }
        });
    }
    static getMailContent(template_link, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const string_template = yield (0, helper_1.readFile)(`src/mail_templates/templates/${template_link}`);
            var message_content = string_template;
            var keys = Object.keys(params);
            for (let i = 0; i < keys.length; i++) {
                message_content = message_content.replace(`{{${keys[i]}}}`, params[keys[i]]);
                message_content = message_content.replace(`{{${keys[i]}}}`, params[keys[i]]);
            }
            return message_content;
        });
    }
}
exports.default = Mailer;
//# sourceMappingURL=Mailer.js.map