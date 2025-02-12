import { IMeeting } from "../meeting.entity";

export interface IMeetingService {
    createMeeting(host: string, participants: string[]): Promise<IMeeting>;
    endMeeting(roomId: string): Promise<IMeeting | null>;
    getMeetingByRoomId(roomId: string): Promise<IMeeting | null>;
    validateParticipant(roomId: string, userId: string): Promise<boolean>;
    generateRoomId(): Promise<string>;
}
