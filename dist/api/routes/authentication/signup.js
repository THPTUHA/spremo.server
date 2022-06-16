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
const user_1 = require("../../../models/user/user");
const BaseError_1 = __importDefault(require("../../../packages/base.error/BaseError"));
const crypto_1 = __importDefault(require("../../../packages/crypto/crypto"));
const valid_1 = __importDefault(require("../../../packages/valid/valid"));
const helper_1 = require("../../../services/helper");
const multer_1 = __importDefault(require("multer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Mailer_1 = __importDefault(require("../../../packages/mailer/Mailer"));
const Constants_1 = require("../../../Constants");
exports.default = (router) => {
    router.post("/signup", (0, multer_1.default)({}).fields([]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username, email, password, confirm_password, is_developer, is_agree } = req.body;
            if (!username) {
                return res.status(200).json(new BaseError_1.default('Username cannot be empty', -1).release());
            }
            if (!email) {
                return res.status(200).json(new BaseError_1.default('Email cannot be empty', -1).release());
            }
            if (is_developer) {
                if (!is_agree) {
                    return res.status(200).json(new BaseError_1.default('You must agree terms!', -1).release());
                }
            }
            var exist_username = yield user_1.UserModel.findOne({
                where: { username: username }
            });
            if (exist_username) {
                return res.status(200).json(new BaseError_1.default('Username existed', -1).release());
            }
            var exist_email = yield user_1.UserModel.findOne({
                where: { email: email }
            });
            if (exist_email) {
                return res.status(200).json(new BaseError_1.default('Email existed', -1).release());
            }
            if (!valid_1.default.email(email)) {
                return res.status(200).json(new BaseError_1.default('Email is invalid', -1).release());
            }
            if (!password) {
                return res.status(200).json(new BaseError_1.default('Email cannot be empty', -1).release());
            }
            if (!confirm_password || (confirm_password != password)) {
                return res.status(200).json(new BaseError_1.default('Confirm password is not matched', -1).release());
            }
            if (!valid_1.default.isUserName(username)) {
                return res.status(200).json(new BaseError_1.default('Username is invalid', -1).release());
            }
            var hash_password = crypto_1.default.hashUsernamePassword(username, password);
            var new_user = {
                email: email,
                username: username,
                fullname: username,
                password: hash_password,
                since: (0, helper_1.time)(),
                avatar: Constants_1.AVATARS[Math.floor(Math.random() * Constants_1.AVATARS.length)],
                last_update: (0, helper_1.time)(),
                role: is_developer ? Constants_1.ROLES.DEVELOPER : Constants_1.ROLES.USER,
                active_status: -1,
                follower_number: 0,
                friends: JSON.stringify([]),
                following: JSON.stringify([])
            };
            const user = yield user_1.UserModel.saveObject(new_user);
            if (!user) {
                return res.status(200).json(new BaseError_1.default('DB Errors', -1).release());
            }
            const token = jsonwebtoken_1.default.sign({
                password: user.password,
                username: user.username,
                email: user.email
            }, process.env.JWT_VERIFY_USER_KEY);
            let content = yield Mailer_1.default.getMailContent("activate_account.html", {
                mail_receiver: user.email,
                link_activate: `${process.env.CLIENT_URL}/authentication/verify?token=${token}`
            });
            const message = yield Mailer_1.default.sendMail([user.email], content, 'Verify Account');
            if (!message) {
                return res.status(200).send(new BaseError_1.default("Email error!", BaseError_1.default.Code.ERROR).release());
            }
            return res.status(200).json(new BaseError_1.default("Register successful", BaseError_1.default.Code.SUCCESS));
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    }));
};
//# sourceMappingURL=signup.js.map