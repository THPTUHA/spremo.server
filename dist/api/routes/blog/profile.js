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
const helper_1 = require("../../../services/helper");
const user_1 = require("../../../models/user/user");
const Constants_1 = require("../../../Constants");
exports.default = (router) => {
    router.post("/profile", (0, multer_1.default)({}).fields([]), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username } = req.body;
            const user = yield user_1.UserModel.findOne({
                where: { username: username }
            });
            if (!user) {
                return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
            }
            const blogs = yield user.getBlogs({ page: 1, page_size: 10, status: [Constants_1.PUBLIC, Constants_1.FRIEND, Constants_1.FRIEND_SPECIFIC], user_id: user.id });
            return res.status(200).send({
                owner: user.release(),
                blogs: blogs.map(blog => blog.release()),
                code: BaseError_1.default.Code.SUCCESS
            });
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=profile.js.map