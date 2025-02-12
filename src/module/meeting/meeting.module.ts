import { Container } from "inversify";
import TYPES from "../../core/container/container.types";
import { MeetingController } from "./meeting.controller";
import { MeetingService } from "./meeting.service";
import { IMeetingService } from "./interfaces/meeting.service.interface";
import { IMeetingRepository } from "./interfaces/meeting.repository.interface";
import { MeetingRepository } from "./meeting.repository";


const loadMeetingContainer = (container: Container) => {
    container.bind<MeetingController>(TYPES.MeetingController).to(MeetingController);
    container.bind<IMeetingService>(TYPES.MeetingService).to(MeetingService);
    container.bind<IMeetingRepository>(TYPES.MeetingRepository).to(MeetingRepository);
}

export {loadMeetingContainer}