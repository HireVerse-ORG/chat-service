import { IPaginationResponse } from "@hireverse/service-common/dist/repository";
import { ConversationDTO, CreateConversationDTO, UpdateConversationLastMessageDTO } from "../dto/conversation.dto";

export interface IConversationService {
  createConversation(dto: CreateConversationDTO): Promise<ConversationDTO>; 
  UpdateConversationLastMessage(dto: UpdateConversationLastMessageDTO): Promise<ConversationDTO>;
  getConversationById(id: string): Promise<ConversationDTO | null>;
  getConversationByParticipantId(participantId: string): Promise<ConversationDTO | null>; 
  getConversationByParticipantIds(participantIds: string[]): Promise<ConversationDTO | null>; 
  listConversationsByParticiPantId(participantId: string, page: number, limit: number): Promise<IPaginationResponse<ConversationDTO>>; 
}
