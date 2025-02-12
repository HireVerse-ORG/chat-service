import { inject, injectable } from "inversify";
import { IMeetingService } from "./interfaces/meeting.service.interface";
import { IMeetingRepository } from "./interfaces/meeting.repository.interface";
import TYPES from "../../core/container/container.types";
import { IMeeting, MeetingStatus } from "./meeting.entity";

@injectable()
export class MeetingService implements IMeetingService {
    @inject(TYPES.MeetingRepository)
    private meetingRepo!: IMeetingRepository;

    async createMeeting(host: string, participants: string[]): Promise<IMeeting> {
        if (!participants.includes(host)) {
            participants.push(host);
        }

        const roomId = await this.generateRoomId();

        return this.meetingRepo.create({
            roomId,
            host,
            participants,
            status: MeetingStatus.Active,
            startedAt: new Date()
        });
    }

    async endMeeting(roomId: string): Promise<IMeeting | null> {
        return this.meetingRepo.update(roomId, {
            status: MeetingStatus.Ended,
            endedAt: new Date()
        });
    }

    async getMeetingByRoomId(roomId: string): Promise<IMeeting | null> {
        return this.meetingRepo.findOne({ roomId });
    }

    async validateParticipant(roomId: string, userId: string): Promise<boolean> {
        const meeting = await this.meetingRepo.findOne({ roomId });
        return !!meeting?.participants.includes(userId);
    }

    async generateRoomId(): Promise<string> {
        const length = 6; 
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        let roomId: string;
        let existingMeeting: IMeeting | null;
    
        do {
            roomId = '';
            for (let i = 0; i < length; i++) {
                roomId += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            existingMeeting = await this.meetingRepo.findOne({ roomId });
        } while (existingMeeting);
    
        return roomId;
    }

}