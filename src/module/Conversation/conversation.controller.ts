import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { AuthRequest } from "@hireverse/service-common/dist/token/user/userRequest";
import { Response } from "express";
import { IConversationService } from "./interfaces/conversation.service.interface";
import { IProfileService } from "../external/profile/profile.service.interface";
import { IPaymentService } from "../external/payment/payment.service.interface";
import { ISocketService } from "../socket/interface/socket.service.interface";
import { ISocketManager } from "../socket/interface/socket.manager.interface";
import { IMessageService } from "../Message/interfaces/message.service.interface";
import { MessageStatus } from "../Message/message.entity";

@injectable()
export class ConversationController {
    @inject(TYPES.ConversationService) private conversationService!: IConversationService;
    @inject(TYPES.ProfileService) private profileService!: IProfileService;
    @inject(TYPES.PaymentService) private paymentService!: IPaymentService;
    @inject(TYPES.MessageService) private messageService!: IMessageService;
    @inject(TYPES.SocketService) private socketService!: ISocketService;
    @inject(TYPES.SocketManager) private socketManager!: ISocketManager;

    /**
    * @route GET /api/chats/conversations/list?page=&limit
    * @scope Private
    **/
    public listConversations = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload?.userId!;
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

        const conversations = await this.conversationService.listConversationsByParticiPantId(userId, page, limit);

        const participants = conversations.data.flatMap(c =>
            c.participants.filter(p => p.id !== userId).map(p => ({ id: p.id, role: p.role }))
        );

        // console.log({ participants });

        // want to fetch profile using that id
        // const conversationWithSenderProfile = {
        //     ...conversation,
        //     senderProfile: {
        //         name: "Google",
        //         type: "company"
        //     }
        // }

        return res.json(conversations)
    });

    /**
    * @route GET /api/chats/conversations/details?participants
    * @scope Private
    **/
    public getConversationDetails = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { participants } = req.query;

        if (!participants || typeof participants !== 'string') {
            return res.status(400).json({ message: "Participants are required" });
        }

        const participantIds = participants.split(",").map(id => id.trim());

        if (participantIds.length < 1) {
            return res.status(400).json({ message: "At least one participant is required" });
        }

        const conversation = await this.conversationService.getConversationByParticipantIds(participantIds);

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        return res.json(conversation);
    });

    /**
    * @route GET /api/chats/conversations/start
    * @scope Private
    **/
    public startConversation = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload?.userId!;
        const userRole = req.payload?.role!;

        const { participantId, participantRole, message } = req.body;

        if (!participantId || !participantRole) {
            return res.status(400).json({ message: "participantId and participantRole are required." });
        }

        if (!message) {
            return res.status(400).json({ message: "Message is reuired" });
        }

        if (userRole === "seeker") {
            const canStart = await this.canSeekerStartConversation(userId, participantId);
            if (canStart !== true) {
                return res.status(400).json({ message: canStart });
            }
        }

        const conversation = await this.conversationService.createConversation({
            participants: [
                { id: userId, role: userRole },
                { id: participantId, role: participantRole }
            ]
        });

        const newMessage = await this.messageService.createMessage({
            conversation: conversation.id,
            content: message,
            sender: userId,
            sentAt: new Date(),
        })

        await this.conversationService.UpdateConversationLastMessage({
            id: conversation.id,
            lastMessage: {
                senderId: newMessage.sender,
                sentAt: newMessage.sentAt!,
                text: newMessage.content,
            }
        })

        const participantSocket = await this.socketManager.getSocketId(participantId);
        if(participantId){
            this.socketService.emit("new-message", {
                from: userId,
                message: newMessage.content
            }, participantSocket);
            
            this.messageService.updateMessageStatus({
                messageId: newMessage.id,
                status: MessageStatus.DELIVERED,
                timestamp: new Date()
            });
        }

        return res.json(conversation);
    });

    private async canSeekerStartConversation(seekerId: string, participantId: string): Promise<true | string> {
        try {
            const { response: followResponse } = await this.profileService.checkIsFollowing({
                followerId: seekerId,
                followingId: participantId,
            });
    
            if (followResponse.isFollowing) {
                return true; 
            }

            console.log({followResponse});
            
    
            const { response: paymentResponse } = await this.paymentService.seekerCanMessage(seekerId);

            console.log({paymentResponse});
    
            if (paymentResponse.canMessage) {
                return true;
            }
    
            return "Upgrade your plan to start a conversation.";
        } catch (error) {
            return "Internal Server Error.";
        }
    }
}