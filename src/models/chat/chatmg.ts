import {Schema,Document, model,Model} from 'mongoose';

interface IChat extends Document{
    id: number,
    user_id: number,
    send_time: number,
    message: string,
    status: number
}

const ChatSchema:Schema = new Schema({
    id: {type: Number, required: true},
    user_id:{type: Number, required: true},
    send_time: {type: Number, required: true},
    message: {type: String, required: true},
    status: {type: Number, required: true},
})

const ChatMG:Model<IChat> = model('Chat',ChatSchema);

export  default ChatMG;