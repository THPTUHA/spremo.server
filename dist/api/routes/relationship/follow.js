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
const user_1 = require("../../../models/user/user");
const follow_1 = require("../../../models/core/follow");
const Constants_1 = require("../../../Constants");
exports.default = (router) => {
    router.post("/follow", (0, multer_1.default)({}).fields([]), passport_1.default.authenticate('jwt', { session: false }), (0, helper_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { user_id } = req.body;
            const user = req.user;
            const user_follow = yield user_1.UserModel.findByPk(user_id);
            let follow_status = Constants_1.PUBLIC;
            if (!user_follow) {
                return res.status(200).send(new BaseError_1.default("User not found!", BaseError_1.default.Code.ERROR).release());
            }
            let follow = yield follow_1.FollowModel.findOne({
                where: { hash_key: follow_1.FollowModel.createHashKey(user_follow.id, user.id) }
            });
            if (follow) {
                return res.status(200).send(new BaseError_1.default("Followed!", BaseError_1.default.Code.ERROR).release());
            }
            follow = yield follow_1.FollowModel.saveObject({
                user_id: user.id,
                user_follow: user_follow.id,
                since: (0, helper_1.time)(),
                hash_key: follow_1.FollowModel.createHashKey(user_follow.id, user.id)
            });
            user_follow.follower_number += 1;
            yield user_follow.edit(["follower_number"]);
            const my_following = user.getFollowing();
            if (user_follow.is(Constants_1.ROLES.DEVELOPER)) {
                const day = (0, helper_1.getExactDayNow)();
                yield user_follow.updateRecord({
                    type: Constants_1.RECORD_TYPE.FOLLOW,
                    day: day,
                    value: 1
                });
                user.following = JSON.stringify(my_following);
                yield user.edit(["following"]);
            }
            else {
                const following = user_follow.getFollowing();
                if (following.includes(user.id)) {
                    user.addFriend(user_follow.id);
                    user_follow.addFriend(user.id);
                    yield user.edit(["friends"]);
                    yield user_follow.edit(["friends"]);
                }
            }
            user.addFollowing(user_follow.id);
            yield user.edit(["following"]);
            return res.status(200).send({
                follow_status: follow_status,
                code: BaseError_1.default.Code.SUCCESS
            });
        }
        catch (error) {
            console.log("ERROR", error);
            return res.status(200).send(new BaseError_1.default("Some errors occurred!", BaseError_1.default.Code.ERROR).release());
        }
    })));
};
//# sourceMappingURL=follow.js.map