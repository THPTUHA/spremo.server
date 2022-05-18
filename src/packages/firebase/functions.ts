import { CommentModel } from '../../models/comment/comment';
import { NotificationModel } from '../../models/core/notification';
import { UserModel } from '../../models/user/user';
import { firebase_db } from './firebase';

class FirebaseFunctions {
    static instance: FirebaseFunctions

    public static init() {
        if (!this.instance) {
            this.instance = new FirebaseFunctions();
        }
        return this.instance;
    }

    public async saveNotification(notification: NotificationModel, from:  {id: number,avatar: string}) {
        await firebase_db.collection("notifications").doc(notification.user_id.toString()).collection("notifications").doc(notification.id.toString()).set({
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
    }

    public async saveComment(comment: CommentModel, user: UserModel) {
        const ref = firebase_db.collection("comments").doc(comment.object_type).collection(comment.object_id.toString()).doc(comment.id.toString())
        
        const snap_shot = await ref.get();
        if(!snap_shot.exists){
            ref.set({
                id : comment.id,
                object_id: comment.object_id,
                object_type: comment.object_type,
                since: comment.since,
                last_update: comment.last_update,
                content: comment.content,
                user_id: comment.user_id,
                user_avatar: user.avatar,
                username: user.username
            })
        }
    }
}

export default FirebaseFunctions;