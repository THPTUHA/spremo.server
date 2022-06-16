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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
exports.default = (router) => {
    router.post('/verify', (0, multer_1.default)({}).fields([]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = req.body;
        console.log("TOKEN", token);
        let user_jwt = null;
        try {
            try {
                user_jwt = jsonwebtoken_1.default.verify(token, process.env.JWT_VERIFY_USER_KEY);
            }
            catch (e) {
                if (e.message == 'jwt expired') {
                    return res.status(200).json(new BaseError_1.default('Token is expired', BaseError_1.default.Code.ERROR).release());
                }
            }
            if (!user_jwt || typeof user_jwt == 'string') {
                return res.status(200).json(new BaseError_1.default('Token is invalid', BaseError_1.default.Code.ERROR).release());
            }
            const user = yield user_1.UserModel.findOne({
                where: {
                    username: user_jwt.username,
                    email: user_jwt.email
                }
            });
            if (!user) {
                return res.status(200).json(new BaseError_1.default('User is invalid', BaseError_1.default.Code.ERROR).release());
            }
            else {
                user.active_status = user_1.UserModel.ACTIVED;
                yield user.save();
            }
            return res.status(200).send({
                code: BaseError_1.default.Code.SUCCESS,
                user: user.release(),
            });
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    }));
};
//# sourceMappingURL=verify.js.map