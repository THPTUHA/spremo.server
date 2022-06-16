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
const comment_1 = require("../../../models/comment/comment");
const user_1 = require("../../../models/user/user");
const console_1 = require("console");
const functions_1 = __importDefault(require("../../../packages/firebase/functions"));
const Constants_1 = require("../../../Constants");
exports.default = (router) => {
    router.post("/comment.add", (0, multer_1.default)({}).fields([{ name: 'image' }, { name: 'audio' }]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { blog_id, content } = req.body;
            if (!content) {
                return res.status(200).send(new BaseError_1.default("Content empty!", BaseError_1.default.Code.ERROR).release());
            }
            const blog = yield blog_1.BlogModel.findByPk(blog_id);
            if (!blog) {
                return res.status(200).send(new BaseError_1.default("Blog not found!", BaseError_1.default.Code.ERROR).release());
            }
            const user = req.user;
            const comment = yield comment_1.CommentModel.saveObject({
                object_id: blog_id,
                object_type: "user_comment",
                user_id: user.id,
                since: (0, console_1.time)(),
                content: content,
                last_update: (0, console_1.time)()
            });
            blog.comment_number = blog.comment_number ? blog.comment_number + 1 : 1;
            yield blog.edit(["comment_number"]);
            const owner = yield user_1.UserModel.findByPk(blog.user_id);
            if (owner.is(Constants_1.ROLES.DEVELOPER)) {
                const day = (0, helper_1.getExactDayNow)();
                yield user.updateRecord({
                    type: Constants_1.RECORD_TYPE.COMMENT,
                    day: day,
                    value: 1
                });
            }
            yield blog.onComment(comment, user, [owner]);
            functions_1.default.init().saveComment(comment, user);
            return res.status(200).send({
                comment: comment.release(),
                code: BaseError_1.default.Code.SUCCESS
            });
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=comment.add.js.map