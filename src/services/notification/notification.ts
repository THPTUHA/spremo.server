import { NotificationModel } from "../../models/core/notification";
import { UserModel } from "../../models/user/user";
import FirebaseFunctions from "../../packages/firebase/functions";
import Valid from "../../packages/valid/valid";
import { time } from "../helper";

export class NotificationService {
    object_id: number;
    object_type: string;
    since: number;
    content: string;
    from_object: {
        id: number,
        avatar: string
    };
    link: string;
    action: string;
    not_send_email: boolean;

    receivers: UserModel[];
    exceptors: UserModel[];

    generate_notification_ids: number[] = [];

    public static init() {
        return new NotificationService();
    }

    public object(object) {
        this.object_id = object.id;
        this.object_type = object.object_type;
        return this;
    }

    public from(from: UserModel) {
        this.from_object = {
            id: from.id,
            avatar: from.avatar
        } 
        return this;
    }

    public setLink(link: string) {
        this.link = link
        return this;
    }

    public setAction(action: string) {
        this.action = action;
        return this;
    }

    public setContent(value) {
        this.content = value;
        return this;
    }

    public setReceivers(users: UserModel[]) {
        this.receivers = users;
        return this;
    }

    public setExcept(users: UserModel[]) {
        this.exceptors = users;
        return this;
    }

    public setNotSendEmail(){
        this.not_send_email = true;
        return this;
    }


    public async send(send_mail: boolean = false) {
        var real_receivers = this.receivers.filter(e => !this.exceptors.find(except => except.id == e.id))
        for (let i = 0; i < real_receivers.length; i++) {
           try {
                let notification = await NotificationModel.saveObject({
                    object_id: this.object_id,
                    object_type: this.object_type,
                    since: time(),
                    content: this.content,
                    user_id: real_receivers[i].id,
                    from_id: this.from_object.id,
                    action: this.action,
                    status: 0,
                    link: this.link,
                })
                await FirebaseFunctions.init().saveNotification(notification,this.from_object);
           } catch (error) {
               console.log("ERROR NOTI",error);
           }
        }
        return this;
    }
}

