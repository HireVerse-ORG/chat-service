import {IMongoRepository} from "@hireverse/service-common/dist/repository"
import { IMeeting } from "../meeting.entity";

export interface IMeetingRepository extends IMongoRepository<IMeeting>{
}
