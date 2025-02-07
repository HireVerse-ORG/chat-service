import { IPaginationResponse } from "@hireverse/service-common/dist/repository";
import { CreateMessageDTO, MessageDTO, UpdateMessageStatusDTO } from "../dto/message.dto";

export interface IMessageService {
  createMessage(dto: CreateMessageDTO): Promise<MessageDTO>; 
  updateMessageStatus(dto: UpdateMessageStatusDTO): Promise<MessageDTO>; 
  listMessagesByConversation(conversationId: string, page: number, limit: number): Promise<IPaginationResponse<MessageDTO>>;
  countUnreadMessages(recipientId: string): Promise<number>; 
}
