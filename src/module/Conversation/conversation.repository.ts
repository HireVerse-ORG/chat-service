import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { injectable } from "inversify";
import Conversation, { IConversation } from "./conversation.entity";
import { IConversationRepository } from "./interfaces/conversation.repository.interface";

@injectable()
export class ConversationRepository extends MongoBaseRepository<IConversation> implements IConversationRepository {
    constructor() {
        super(Conversation)
    }

}