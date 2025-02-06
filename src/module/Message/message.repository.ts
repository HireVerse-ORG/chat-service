import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { injectable } from "inversify";
import Message, { IMessage } from "./message.entity";
import { IMessageRepository } from "./interfaces/message.repository.interface";

@injectable()
export class MessageRepository extends MongoBaseRepository<IMessage> implements IMessageRepository {
    constructor() {
        super(Message)
    }

}