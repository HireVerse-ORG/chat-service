import {IMongoRepository} from "@hireverse/service-common/dist/repository"
import { IConversation } from "../conversation.entity";

export interface IConversationRepository extends IMongoRepository<IConversation>{
}
