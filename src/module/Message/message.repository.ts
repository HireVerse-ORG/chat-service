import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { injectable } from "inversify";
import Message, { IMessage } from "./message.entity";
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

    async updateAllMessages(filter: RootFilterQuery<IMessage>, data: Partial<IMessage>): Promise<boolean> {
        try {
            // console.log({filter});
            const updated = await this.repository.updateMany(filter, {$set: data});
            // console.log({updated});
            return updated.modifiedCount > 0;
        } catch (error) {
            throw new InternalError("Failed to update messages");
        }
    }

}