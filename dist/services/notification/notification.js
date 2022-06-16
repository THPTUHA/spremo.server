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
exports.NotificationService = void 0;
const notification_1 = require("../../models/core/notification");
const functions_1 = __importDefault(require("../../packages/firebase/functions"));
const helper_1 = require("../helper");
class NotificationService {
    constructor() {
        this.generate_notification_ids = [];
    }
    static init() {
        return new NotificationService();
    }
    object(object) {
        this.object_id = object.id;
        this.object_type = object.object_type;
        return this;
    }
    from(from) {
        this.from_object = {
            id: from.id,
            avatar: from.avatar
        };
        return this;
    }
    setLink(link) {
        this.link = link;
        return this;
    }
    setAction(action) {
        this.action = action;
        return this;
    }
    setContent(value) {
        this.content = value;
        return this;
    }
    setReceivers(users) {
        this.receivers = users;
        return this;
    }
    setExcept(users) {
        this.exceptors = users;
        return this;
    }
    setNotSendEmail() {
        this.not_send_email = true;
        return this;
    }
    send(send_mail = false) {
        return __awaiter(this, void 0, void 0, function* () {
            var real_receivers = this.receivers.filter(e => !this.exceptors.find(except => except.id == e.id));
            for (let i = 0; i < real_receivers.length; i++) {
                try {
                    let notification = yield notification_1.NotificationModel.saveObject({
                        object_id: this.object_id,
                        object_type: this.object_type,
                        since: (0, helper_1.time)(),
                        content: this.content,
                        user_id: real_receivers[i].id,
                        from_id: this.from_object.id,
                        action: this.action,
                        status: 0,
                        link: this.link,
                    });
                    yield functions_1.default.init().saveNotification(notification, this.from_object);
                }
                catch (error) {
                    console.log("ERROR NOTI", error);
                }
            }
            return this;
        });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.js.map