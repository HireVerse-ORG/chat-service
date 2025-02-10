import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { injectable } from "inversify";
import Message, { IMessage, MessageStatus } from "./message.entity";
import { IMessageRepository } from "./interfaces/message.repository.interface";
import { RootFilterQuery } from "mongoose";
import { InternalError } from "@hireverse/service-common/dist/app.errors";

@injectable()
export class MessageRepository extends MongoBaseRepository<IMessage> implements IMessageRepository {
    constructor() {
        super(Message)
    }

    async countMessages(filter?: RootFilterQuery<IMessage>): Promise<number> {
        try {
            const count = this.repository.countDocuments(filter);
            return count;
        } catch (error) {
            throw new InternalError("Failed to count messages")
        }
    }

    async updateAllMessages(filter: RootFilterQuery<IMessage>, data: Partial<IMessage>): Promise<{modifiedCount: number}> {
        try {
            const updated = await this.repository.updateMany(filter, {$set: data});
            return {modifiedCount: updated.modifiedCount};
        } catch (error) {
            throw new InternalError("Failed to update messages");
        }
    }

    async countUnreadConversations(recipient: string): Promise<number> {
        try {
            const conversationIds = await this.repository.distinct('conversation', {
                recipient,
                status: {$ne: MessageStatus.READ}
            })
            return conversationIds.length;
        } catch (error) {
            throw new InternalError("Failed to count conversations");
        }
    }

}