import { injectable } from "inversify";
import { IMeeting, Meeting } from "./meeting.entity";
import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { IMeetingRepository } from "./interfaces/meeting.repository.interface";

@injectable()
export class MeetingRepository extends MongoBaseRepository<IMeeting> implements IMeetingRepository {
    constructor() {
        super(Meeting)
    }
}