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
const BaseError_1 = __importDefault(require("../../../packages/base.error/BaseError"));
const multer_1 = __importDefault(require("multer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const helper_1 = require("../../../services/helper");
exports.default = (router) => {
    router.post("/signin", (0, multer_1.default)({}).fields([]), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { keep_login } = req.body;
            passport_1.default.authenticate('signin', (error, user, arg) => {
                var code = parseInt(arg.message);
                if (code != BaseError_1.default.Code.SUCCESS) {
                    var message = "";
                    if (code == BaseError_1.default.Code.INACTIVATE_AUTH) {
                        message = "Your email is not verified!";
                    }
                    else if (code == BaseError_1.default.Code.INVALID_AUTH || code == BaseError_1.default.Code.INVALID_PASSWORD) {
                        message = "Username or password is not correct!";
                    }
                    else {
                        message = "Some error occurred!";
                    }
                    return res.status(200).json(new BaseError_1.default(message, code).release());
                }
                if (user) {
                    req.login(user, { session: false }, (error) => __awaiter(void 0, void 0, void 0, function* () {
                        const body = { id: user.id, name: user.name, email: user.email, username: user.username };
                        let config = {};
                        if (keep_login) {
                            config.expiresIn = '24h';
                        }
                        const access_token = jsonwebtoken_1.default.sign({ user: body }, process.env.JWT_ENCODE_USER_KEY, config);
                        return res.status(200).json({ access_token, id: user.id, code });
                    }));
                }
                else {
                    return res.status(200).json(new BaseError_1.default("Some error occurred!", BaseError_1.default.Code.ERROR).release());
                }
            })(req, res);
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=signin.js.map