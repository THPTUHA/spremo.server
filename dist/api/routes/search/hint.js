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
const tag_1 = require("../../../models/tag/tag");
const sequelize_1 = require("sequelize");
const user_1 = require("../../../models/user/user");
exports.default = (router) => {
    router.post("/hint", (0, multer_1.default)({}).fields([]), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { q } = req.body;
            if (!q) {
                return res.status(200).send(new BaseError_1.default("", BaseError_1.default.Code.ERROR).release());
            }
            const tags = yield tag_1.TagModal.paginate({
                where: {
                    name: {
                        [sequelize_1.Op.like]: `${q}%`
                    }
                }
            }, { page: 1, page_size: 10 });
            const users = yield user_1.UserModel.paginate({
                where: {
                    username: {
                        [sequelize_1.Op.like]: `${q}%`
                    }
                }
            }, { page: 1, page_size: 10 });
            return res.status(200).send({
                tags: tags.map(tag => tag.name),
                users: users.map(users => users.release()),
                code: BaseError_1.default.Code.SUCCESS
            });
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=hint.js.map