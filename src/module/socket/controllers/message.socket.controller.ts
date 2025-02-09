import { inject, injectable } from "inversify";
import AuthSocket from "../interface/socket.interface";
import { BaseSocketController } from "./base.socket.controller";
import TYPES from "../../../core/container/container.types";
import { IMessageService } from "../../Message/interfaces/message.service.interface";
import { IConversationService } from "../../Conversation/interfaces/conversation.service.interface";
import { MessageStatus } from "../../Message/message.entity";

@injectable()
export class MessageSocketController extends BaseSocketController {
    @inject(TYPES.ConversationService) private conversationService!: IConversationService;
    @inject(TYPES.MessageService) private messageService!: IMessageService;
    
    public handleConnection(socket: AuthSocket): void {
        this.setupRoutes(socket);
    }

    private setupRoutes(socket: AuthSocket) {
        socket.on('send-message', (data) => this.onMessage(socket, data));
        socket.on('read-message', (data) => this.onReadMessage(socket, data));
    }

    private async onMessage(socket: AuthSocket, data: { roomId: string, message: string}) {
        const conversation = await this.conversationService.getConversationById(data.roomId);
        
        if (!conversation) return;

        const participant = conversation.participants.find(p => p.id !== socket.payload?.userId);
        if(!participant) return;

        let newMessage = await this.messageService.createMessage({
            content: data.message,
            conversation: data.roomId,
            sender: socket.payload?.userId!,
            recipient: participant.id,
            sentAt: new Date(),
        })

        socket.emit("message-send", newMessage);

        await this.conversationService.UpdateConversationLastMessage({id: conversation.id, lastMessageId: newMessage.id});

        const participantSocketId = await this.socketManager.getSocketId(participant.id);

        if(participantSocketId) {
            newMessage = await this.messageService.updateMessageStatus({
                messageId: newMessage.id,
                status: MessageStatus.DELIVERED,
                timestamp: new Date()
            })
            socket.emit("message-updated", newMessage);
            socket.to(participantSocketId).emit("new-message-notification", newMessage);
        }
    
        socket.to(data.roomId).emit("new-message", newMessage);
    }

    private async onReadMessage(socket: AuthSocket, data: {roomId: string, messageId: string}) {
        try {            
            const message = await this.messageService.updateMessageStatus({
                messageId: data.messageId,
                status: MessageStatus.READ,
                timestamp: new Date()
            })
    
            socket.to(data.roomId).emit("message-updated", message)
        } catch (error) {
            console.log("error");
        }
    }
    
}