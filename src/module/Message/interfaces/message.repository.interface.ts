import {IMongoRepository} from "@hireverse/service-common/dist/repository"
import { IMessage } from "../message.entity";
import { RootFilterQuery } from "mongoose";

export interface IMessageRepository extends IMongoRepository<IMessage>{
    countMessages(filter?: RootFilterQuery<IMessage>): Promise<number>;
    countUnreadConversations(recipient: string): Promise<number>
    updateAllMessages(filter: RootFilterQuery<IMessage>, data: Partial<IMessage>): Promise<{modifiedCount: number}>;
}
