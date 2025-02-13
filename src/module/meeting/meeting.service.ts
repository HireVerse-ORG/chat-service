import { inject, injectable } from "inversify";
import { IMeetingService } from "./interfaces/meeting.service.interface";
import { IMeetingRepository } from "./interfaces/meeting.repository.interface";
import TYPES from "../../core/container/container.types";
import { IMeeting, IParticipant, MeetingStatus } from "./meeting.entity";
import { MeetingDto } from "./dto/meeting.dto";

@injectable()
export class MeetingService implements IMeetingService {
    @inject(TYPES.MeetingRepository)
    private meetingRepo!: IMeetingRepository;

    async createMeeting(host: string, participants: IParticipant[], meetingIdentifier?: string): Promise<MeetingDto> {
        const roomId = await this.generateRoomId();

        const meeting = await this.meetingRepo.create({
            roomId,
            meetingIdentifier,
            host,
            participants,
            status: MeetingStatus.Active,
            startedAt: new Date()
        });

        return this.toDTO(meeting);
    }

    async endMeeting(roomId: string): Promise<MeetingDto | null> {
        const meeting = await this.meetingRepo.findOne({roomId});

        if(meeting){
            const updatedMeeting = await this.meetingRepo.update(meeting.id, {
                status: MeetingStatus.Ended,
                endedAt: new Date()
            });

            return updatedMeeting ? this.toDTO(updatedMeeting) : null;
        }
        
        return null
    }

    async getMeetingByRoomId(roomId: string): Promise<MeetingDto | null> {
        const meeting = await this.meetingRepo.findOne({ roomId });
        return meeting ? this.toDTO(meeting) : null;
    }

    async validateParticipant(roomId: string, userId: string): Promise<boolean> {
        const meeting = await this.meetingRepo.findOne({ roomId });
        return !!meeting?.participants.find((p) => p.id === userId);
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

    private toDTO(data: IMeeting): MeetingDto {
        return {
            roomId: data.roomId,
            meetingIdentifier: data.meetingIdentifier,
            host: data.host,
            participants: data.participants,
            startedAt: data.startedAt,
            endedAt: data.endedAt,
            status: data.status,
        }
    }

}