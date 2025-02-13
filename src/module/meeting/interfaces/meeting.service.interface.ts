import { MeetingDto } from "../dto/meeting.dto";
import { IParticipant } from "../meeting.entity";

export interface IMeetingService {
    createMeeting(host: string, participants: IParticipant[], meetingIdentifier?: string): Promise<MeetingDto>;
    endMeeting(roomId: string): Promise<MeetingDto | null>;
    getMeetingByRoomId(roomId: string): Promise<MeetingDto | null>;
    validateParticipant(roomId: string, userId: string): Promise<boolean>;
    generateRoomId(): Promise<string>;
}
