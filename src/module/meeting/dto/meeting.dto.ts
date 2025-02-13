import { IParticipant, MeetingStatus } from "../meeting.entity";

export interface MeetingDto {
    roomId: string;
    meetingIdentifier?: string;
    host: string;
    participants: IParticipant[];
    startedAt: Date;
    endedAt?: Date;
    status: MeetingStatus;
}