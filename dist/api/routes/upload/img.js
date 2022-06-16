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
const cloudinary_1 = __importDefault(require("../../../packages/cloudinary/cloudinary"));
const fs_1 = __importDefault(require("fs"));
exports.default = (router) => {
    router.post("/img", (0, multer_1.default)({}).fields([{ name: 'image' }]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user;
        if (!user) {
            return res.status(200).send(new BaseError_1.default("Please login!", BaseError_1.default.Code.ERROR).release());
        }
        try {
            const { name } = req.body;
            if (!req.files || !req.files['image'] || req.files['image'].length == 0) {
                return res.status(200).send(new BaseError_1.default("Image can not be empty!", -1).release());
            }
            var image = req.files['image'][0];
            let uploadLocation = __dirname + image.originalname;
            fs_1.default.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(image.buffer)));
            const config = {
                upload_preset: 'emotion',
            };
            if (name) {
                config.public_id = name;
            }
            const uploadResponse = yield cloudinary_1.default.uploader.upload(uploadLocation, config);
            fs_1.default.unlink(uploadLocation, (deleteErr) => {
                console.log('temp file was deleted');
            });
            console.log("Upload", uploadResponse);
            res.status(200).send({
                url: uploadResponse.url,
                code: BaseError_1.default.Code.SUCCESS
            });
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=img.js.map