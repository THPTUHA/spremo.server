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
const helper_1 = require("../../../services/helper");
const blog_1 = require("../../../models/blog/blog");
exports.default = (router) => {
    router.post("/draw.get", (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, is_me } = req.body;
        try {
            // if(is_me){
            //     const user =
            // }
            const draw = yield blog_1.BlogModel.findByPk(id);
            if (!draw) {
                return res.status(200).send(new BaseError_1.default("Draw is not exist!", BaseError_1.default.Code.ERROR).release());
            }
            return res.status(200).send({
                draw: draw.release(),
                code: BaseError_1.default.Code.SUCCESS
            });
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=get.js.map