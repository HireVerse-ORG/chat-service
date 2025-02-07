import mongoose, { Schema, Document } from "mongoose";

export enum MessageStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read",
}

export interface IMessage extends Document {
    conversation: string;
    sender: string;
    recipient: string;
    content: string;
    status: MessageStatus;
    deliveredAt?: Date; 
    readAt?: Date; 
    sentAt?: Date; 
}

const MessageSchema = new Schema<IMessage>(
    {
        conversation: { type: String, required: true },
        sender: { type: String, required: true },
        recipient: { type: String, required: true },
        content: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(MessageStatus),
            default: MessageStatus.SENT,
        },
        deliveredAt: { type: Date },
        readAt: { type: Date },
        sentAt: { type: Date },
    },
);

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
