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
exports.updateManyTag = exports.updateOneTag = exports.getExactDayNow = exports.convertArrayToIndex = exports.uploadFile = exports.isValidShareOption = exports.isValidBlogType = exports.isValidStatus = exports.castToNumber = exports.getEmotionIdFromTags = exports.getEmotion = exports.wrapSocket = exports.wrapAsync = exports.readFile = exports.time = exports.generateCode = void 0;
const fs_1 = __importDefault(require("fs"));
const Constants_1 = require("../Constants");
const map_tag_1 = require("../models/map.tag/map.tag");
const tag_1 = require("../models/tag/tag");
const cloudinary_1 = __importDefault(require("../packages/cloudinary/cloudinary"));
function generateCode(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '_');
}
exports.generateCode = generateCode;
;
const time = function () {
    return Math.floor(new Date().getTime() / 1000);
};
exports.time = time;
const readFile = function (path) {
    return new Promise((resolve, reject) => {
        try {
            const res = fs_1.default.readFileSync(path, 'utf8');
            resolve(res);
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.readFile = readFile;
function wrapAsync(fn) {
    return function (req, res, next) {
        // Make sure to `.catch()` any errors and pass them along to the `next()`
        // middleware in the chain, in this case the error handler.
        fn(req, res, next).catch(next);
    };
}
exports.wrapAsync = wrapAsync;
function wrapSocket(fn) {
    return function (socket) {
        fn(socket);
    };
}
exports.wrapSocket = wrapSocket;
function getEmotion(id) {
    id = castToNumber(id);
    id = id ? id : 0;
    for (let i = 0; i < Constants_1.EMOTIONS.length; ++i) {
        if (Constants_1.EMOTIONS[i].id == id)
            return Constants_1.EMOTIONS[i];
    }
    return Constants_1.EMOTIONS[0];
}
exports.getEmotion = getEmotion;
function getEmotionIdFromTags(tags) {
    const ids = [];
    for (const emotion of Constants_1.EMOTIONS) {
        if (tags.includes(emotion.name)) {
            ids.push(emotion.id);
        }
    }
    return ids;
}
exports.getEmotionIdFromTags = getEmotionIdFromTags;
function castToNumber(num) {
    if (typeof num == "number") {
        return num;
    }
    if (typeof num == "string") {
        num = parseInt(num);
        return num == NaN ? 0 : num;
    }
    return 0;
}
exports.castToNumber = castToNumber;
function isValidStatus(status) {
    return status == Constants_1.PRIVATE || status == Constants_1.PUBLIC || status == Constants_1.DRAFT || status == Constants_1.FRIEND;
}
exports.isValidStatus = isValidStatus;
function isValidBlogType(type) {
    const keys = Object.keys(Constants_1.BLOG_TYPES);
    for (const i in keys) {
        if (Constants_1.BLOG_TYPES[keys[i]] == type)
            return type;
    }
    return 0;
}
exports.isValidBlogType = isValidBlogType;
function isValidShareOption(share_option_id) {
    for (const share of Constants_1.SHARE_OPTIONS) {
        if (share.id == share_option_id) {
            return true;
        }
    }
    return false;
}
exports.isValidShareOption = isValidShareOption;
function uploadFile(file, name, type) {
    return __awaiter(this, void 0, void 0, function* () {
        let uploadLocation = __dirname + file.originalname;
        fs_1.default.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(file.buffer)));
        const config = {
            upload_preset: 'emotion',
        };
        if (name) {
            config.public_id = name;
        }
        if (type) {
            config.resource_type = type;
        }
        const uploadResponse = yield cloudinary_1.default.uploader.upload(uploadLocation, config);
        fs_1.default.unlink(uploadLocation, (deleteErr) => {
            console.log('File was deleted');
        });
        return uploadResponse;
    });
}
exports.uploadFile = uploadFile;
function convertArrayToIndex(arr) {
    let index = "";
    if (typeof arr == 'string') {
        arr = JSON.parse(arr);
        for (let i = 0; i < arr.length; ++i) {
            index += arr[i] + "#";
        }
    }
    else {
        for (let i = 0; i < arr.length; ++i) {
            index += arr[i] + "#";
        }
    }
    return index;
}
exports.convertArrayToIndex = convertArrayToIndex;
function getExactDayNow() {
    const day = new Date();
    const time = Math.floor(day.getTime() / 1000);
    return time - day.getHours() * 3600 - day.getMinutes() * 60 - day.getSeconds();
}
exports.getExactDayNow = getExactDayNow;
function updateOneTag({ tag, user_id, blog }) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag_exist = yield tag_1.TagModal.findOne({
            where: { name: tag }
        });
        if (!tag_exist) {
            tag_exist = yield tag_1.TagModal.saveObject({
                name: tag,
                user_id: user_id,
                created_time: (0, exports.time)()
            });
        }
        else {
            yield map_tag_1.MapTagModal.destroy({
                where: {
                    blog_id: blog.id
                }
            });
        }
        yield map_tag_1.MapTagModal.saveObject({
            blog_id: blog.id,
            hash_key: map_tag_1.MapTagModal.setHashKey(tag, blog.status, user_id, blog.id),
            tag_id: tag_exist.id
        });
    });
}
exports.updateOneTag = updateOneTag;
function updateManyTag({ tags, user_id, blog }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Tags.....", tags);
        let list_tag = yield tag_1.TagModal.findAll({
            where: { name: tags }
        });
        const tags_nonexist = [];
        for (let i = 0; i < tags.length; ++i) {
            let check = false;
            for (let j = 0; j < list_tag.length; ++j) {
                if (tags[i] == list_tag[j].name) {
                    check = true;
                    break;
                }
            }
            if (!check) {
                tags_nonexist.push(tags[i]);
            }
        }
        for (let i = 0; i < tags_nonexist.length; ++i) {
            const tag = yield tag_1.TagModal.saveObject({
                name: tags_nonexist[i],
                user_id: user_id,
                created_time: (0, exports.time)()
            });
            list_tag.push(tag);
        }
        if (list_tag.length) {
            yield map_tag_1.MapTagModal.destroy({
                where: {
                    blog_id: blog.id
                }
            });
        }
        console.log("LIST_TAGS------", list_tag);
        for (let i = 0; i < list_tag.length; ++i) {
            yield map_tag_1.MapTagModal.saveObject({
                blog_id: blog.id,
                hash_key: map_tag_1.MapTagModal.setHashKey(list_tag[i].name, blog.status, user_id, blog.id),
                tag_id: list_tag[i].id
            });
        }
    });
}
exports.updateManyTag = updateManyTag;
//# sourceMappingURL=helper.js.map