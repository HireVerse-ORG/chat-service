import { MessageStatus } from "../message.entity";

export interface MessageDTO {
    id: string;
    conversation: string;
    sender: string;
    content: string;
    status: MessageStatus;
    deliveredAt?: Date;
    readAt?: Date;
    sentAt?: Date; 
}

export interface CreateMessageDTO {
    conversation: string;
    sender: string;
    content: string;
    sentAt?: Date; 
}

export interface UpdateMessageStatusDTO {
    messageId: string;
    status: MessageStatus;
    timestamp: Date;
}
