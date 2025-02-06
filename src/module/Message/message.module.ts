import { Container } from "inversify";
import TYPES from "../../core/container/container.types";
import { MessageController } from "./message.controller";
import { IMessageService } from "./interfaces/message.service.interface";
import { MessageService } from "./message.service";
import { IMessageRepository } from "./interfaces/message.repository.interface";
import { MessageRepository } from "./message.repository";

export function loadMessageContainer(container: Container) {
    container.bind<MessageController>(TYPES.MessageController).to(MessageController);
    container.bind<IMessageService>(TYPES.MessageService).to(MessageService);
    container.bind<IMessageRepository>(TYPES.MessageRepository).to(MessageRepository);
}