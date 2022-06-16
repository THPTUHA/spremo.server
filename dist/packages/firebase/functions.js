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
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("./firebase");
class FirebaseFunctions {
    static init() {
        if (!this.instance) {
            this.instance = new FirebaseFunctions();
        }
        return this.instance;
    }
    saveNotification(notification, from) {
        return __awaiter(this, void 0, void 0, function* () {
            yield firebase_1.firebase_db.collection("notifications").doc(notification.user_id.toString()).collection("notifications").doc(notification.id.toString()).set({
                object_id: notification.object_id,
                object_type: notification.object_type,
                since: notification.since,
                content: notification.content,
                user_id: notification.user_id,
                from_id: notification.from_id,
                action: notification.action,
                link: notification.link,
                from_avatar: from.id,
                from_name: from.avatar
            });
        });
    }
    saveComment(comment, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = firebase_1.firebase_db.collection("comments").doc(comment.object_type).collection(comment.object_id.toString()).doc(comment.id.toString());
            const snap_shot = yield ref.get();
            if (!snap_shot.exists) {
                ref.set({
                    id: comment.id,
                    object_id: comment.object_id,
                    object_type: comment.object_type,
                    since: comment.since,
                    last_update: comment.last_update,
                    content: comment.content,
                    user_id: comment.user_id,
                    user_avatar: user.avatar,
                    username: user.username
                });
            }
        });
    }
}
exports.default = FirebaseFunctions;
//# sourceMappingURL=functions.js.map