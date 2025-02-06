import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { IConversationService } from "./interfaces/conversation.service.interface";
import { IConversationRepository } from "./interfaces/conversation.repository.interface";
import { CreateConversationDTO, ConversationDTO, UpdateConversationLastMessageDTO } from "./dto/conversation.dto";
import { IConversation } from "./conversation.entity";
import { isValidObjectId } from "mongoose";
import { BadRequestError } from "@hireverse/service-common/dist/app.errors";
import { IPaginationResponse } from "@hireverse/service-common/dist/repository";

@injectable()
export class ConversationService implements IConversationService {
    @inject(TYPES.ConversationRepository) private conversationRepo!: IConversationRepository;

    async createConversation(dto: CreateConversationDTO): Promise<ConversationDTO> {
        const conversation = await this.conversationRepo.create(dto);
        return this.toDTO(conversation);
    }

    async UpdateConversationLastMessage(dto: UpdateConversationLastMessageDTO): Promise<ConversationDTO> {
        if(!isValidObjectId(dto.id)){
            throw new BadRequestError("Invalid conversation id");
        }

        const {id, lastMessage} = dto;
        const conversation = await this.conversationRepo.update(id, {lastMessage});

        if(!conversation) {
            throw new BadRequestError("Failed update last message of conversation");
        }

        return this.toDTO(conversation);
    }

    async getConversationByParticipantId(participantId: string): Promise<ConversationDTO | null> {
        const conversation = await this.conversationRepo.findOne({
            "participants.id": participantId
        });
    
        return conversation ? this.toDTO(conversation) : null;
    }

    async getConversationByParticipantIds(participantIds: string[]): Promise<ConversationDTO | null> {
        const conversation = await this.conversationRepo.findOne({
            "participants.id": { $all: participantIds } 
        });

        return conversation ? this.toDTO(conversation) : null;
    }
    
    
    async listConversationsByParticiPantId(participantId: string, page: number, limit: number): Promise<IPaginationResponse<ConversationDTO>> {
        const conversation = await this.conversationRepo.paginate({"participants.id": participantId}, page, limit, {sort: {updatedAt: -1}});
        return {...conversation, data: conversation.data.map(this.toDTO)};
    }

    private toDTO(data: IConversation): ConversationDTO {
        return {
            id: data.id,
            participants: data.participants,
            lastMessage: data.lastMessage,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
    }
}