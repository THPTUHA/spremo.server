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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const user_1 = require("../models/user/user");
const BaseError_1 = __importDefault(require("../packages/base.error/BaseError"));
exports.default = ({ app }) => {
    passport_1.default.use('signin', new passport_local_1.default.Strategy(function (username, password, done) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield user_1.UserModel.findOne({
                where: { username: username }
            });
            if (!user) {
                user = yield user_1.UserModel.findOne({
                    where: { email: username.replace(/\s/g, '') }
                });
            }
            if (!user) {
                return done(null, false, { message: BaseError_1.default.Code.INVALID_AUTH.toString() });
            }
            var user_obj = user.toJSON();
            if (!user_1.UserModel.checkCorrectPassword(user_obj.username, password, user_obj.password)) {
                return done(null, false, { message: BaseError_1.default.Code.INVALID_PASSWORD.toString() });
            }
            if (!user.isActiveAccount()) {
                return done(null, false, { message: BaseError_1.default.Code.INACTIVATE_AUTH.toString() });
            }
            return done(null, user_obj, { message: BaseError_1.default.Code.SUCCESS.toString() });
        });
    }));
    passport_1.default.use(new passport_jwt_1.default.Strategy({
        secretOrKey: process.env.JWT_ENCODE_USER_KEY,
        jwtFromRequest: passport_jwt_1.default.ExtractJwt.fromBodyField('access_token')
    }, (token, done) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_1.UserModel.findByPk(token.user.id);
        return done(null, user);
    })));
    passport_1.default.serializeUser(function (user, done) {
        done(null, user.id);
    });
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
};
//# sourceMappingURL=passport.js.map