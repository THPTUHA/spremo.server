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
const passport_1 = __importDefault(require("passport"));
const helper_1 = require("../../../services/helper");
const blog_1 = require("../../../models/blog/blog");
const Constants_1 = require("../../../Constants");
const helper_2 = require("../../../services/helper");
exports.default = (router) => {
    router.post("/pick.blog", (0, multer_1.default)({}).fields([]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            const user = req.user;
            if (!user || (!user.is(Constants_1.ROLES.ADMIN) && !user.is(Constants_1.ROLES.CENSOR))) {
                return res.status(200).send(new BaseError_1.default("You have no right!", BaseError_1.default.Code.ERROR).release());
            }
            const blog = yield blog_1.BlogModel.findByPk(id);
            if (!blog) {
                return res.status(200).send(new BaseError_1.default("Blog not found!", BaseError_1.default.Code.ERROR).release());
            }
            blog.selected = blog.selected == Constants_1.SELECTED ? 0 : Constants_1.SELECTED;
            blog.selected_since = (0, helper_2.time)();
            yield blog.edit(["selected", "selected_since"]);
            return res.status(200).send({
                message: "Pick successful",
                code: BaseError_1.default.Code.SUCCESS
            });
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=pick.blog.js.map