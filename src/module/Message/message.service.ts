import { inject, injectable } from "inversify";
import { IMessageService } from "./interfaces/message.service.interface";
import TYPES from "../../core/container/container.types";
import { IMessageRepository } from "./interfaces/message.repository.interface";
import { CreateMessageDTO, MessageDTO, UpdateMessageStatusDTO } from "./dto/message.dto";
import { IMessage, MessageStatus } from "./message.entity";
import { isValidObjectId } from "mongoose";
import { BadRequestError } from "@hireverse/service-common/dist/app.errors";
import { IPaginationResponse } from "@hireverse/service-common/dist/repository";

@injectable()
export class MessageService implements IMessageService {
    @inject(TYPES.MessageRepository) private meesageRepo!: IMessageRepository;

    async createMessage(dto: CreateMessageDTO): Promise<MessageDTO> {
        const message = await this.meesageRepo.create({...dto, sentAt: dto.sentAt || new Date()});
        return this.toDTO(message);
    }

    async updateMessageStatus(dto: UpdateMessageStatusDTO): Promise<MessageDTO> {
        if(!isValidObjectId(dto.messageId)){
            throw new BadRequestError("Invalid message id");
        }
        const {messageId, status, timestamp} = dto;
        const data:Partial<IMessage> = {status};
        if(status === MessageStatus.SENT) {  
            data.sentAt = timestamp;
        }
        if(status === MessageStatus.READ) {  
            data.readAt = timestamp;
        }
        if(status === MessageStatus.DELIVERED) {  
            data.deliveredAt = timestamp;
        }
        const message = await this.meesageRepo.update(messageId, data);

        if(!message){
            throw new BadRequestError("Failed to update message status");
        }

        return this.toDTO(message);
    }

    async listMessagesByConversation(conversationId: string, page: number, limit: number): Promise<IPaginationResponse<MessageDTO>> {
        const messages =  await this.meesageRepo.paginate({conversation: conversationId}, page, limit, {sort: {sentAt: -1}});
        // console.log({messages});
        
        return {...messages, data: messages.data.map(this.toDTO)};
    }

    async countUnreadMessages(recipientId: string): Promise<number> {
        const count = await this.meesageRepo.countMessages({
            recipient: recipientId,
            status: { $ne: MessageStatus.READ }
        });
        return count;
    }

    async readAll(conversation: string, recipient: string): Promise<boolean> {
        const updated = await this.meesageRepo.updateAllMessages({
            conversation, 
            recipient,
            status: { $ne: MessageStatus.READ } 
        }, {
            status: MessageStatus.READ,
            readAt: new Date(),
        })
        return updated;
    }

    private toDTO(message: IMessage): MessageDTO {
        return {
            id: message.id,
            conversation: message.conversation,
            sender: message.sender,
            content: message.content,
            status: message.status,
            deliveredAt: message.deliveredAt,
            readAt: message.readAt,
            sentAt: message.sentAt,
        };
    }
}