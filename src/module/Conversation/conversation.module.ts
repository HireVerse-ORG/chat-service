import { Container } from "inversify";
import TYPES from "../../core/container/container.types";
import { ConversationController } from "./conversation.controller";
import { IConversationService } from "./interfaces/conversation.service.interface";
import { ConversationService } from "./conversation.service";
import { IConversationRepository } from "./interfaces/conversation.repository.interface";
import { ConversationRepository } from "./conversation.repository";

export function loadConversationContainer(container: Container) {
    container.bind<ConversationController>(TYPES.ConversationController).to(ConversationController);
    container.bind<IConversationService>(TYPES.ConversationService).to(ConversationService);
    container.bind<IConversationRepository>(TYPES.ConversationRepository).to(ConversationRepository);
}