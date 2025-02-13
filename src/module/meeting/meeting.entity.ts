import { UserRole } from '@hireverse/service-common/dist/token/user/userPayload';
import { Schema, model, Document } from 'mongoose';

export enum MeetingStatus {
    Active = 'active',
    Ended = 'ended'
}

export interface IParticipant {
    id: string;
    role: UserRole;
}

export interface IMeeting extends Document {
    roomId: string;
    meetingIdentifier?: string;
    host: string;
    participants: IParticipant[];
    startedAt: Date;
    endedAt?: Date;
    status: MeetingStatus;
}

const MeetingSchema = new Schema<IMeeting>({
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    meetingIdentifier: {
        type: String
    },
    host: {
        type: String,
        required: true
    },
    participants: {
        _id: false,
        type: [
            {
                id: { type: String, required: true },
                role: { type: String, required: true },
            },
        ],
        required: true,
        validate: {
            validator: (participants: any[]) => participants.length > 0,
            message: 'At least one participant is required',
        },
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    endedAt: {
        type: Date
    },
    status: {
        type: String,
        enum: Object.values(MeetingStatus),
        default: MeetingStatus.Active
    }
});

// Indexes
MeetingSchema.index({ status: 1 });
MeetingSchema.index({ host: 1, status: 1 });

export const Meeting = model<IMeeting>('Meeting', MeetingSchema);