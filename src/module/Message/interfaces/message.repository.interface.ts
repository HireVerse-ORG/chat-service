import {IMongoRepository} from "@hireverse/service-common/dist/repository"
import { IMessage } from "../message.entity";

export interface IMessageRepository extends IMongoRepository<IMessage>{
}
