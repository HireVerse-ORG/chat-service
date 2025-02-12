import { Schema, model, Document } from 'mongoose';

export enum MeetingStatus {
    Active = 'active',
    Ended = 'ended'
}

export interface IMeeting extends Document {
    roomId: string;
    host: string;
    participants: string[];
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
    host: {
        type: String,
        required: true
    },
    participants: {
        type: [String],
        required: true,
        validate: {
            validator: (participants: string[]) => participants.length > 0,
            message: 'At least one participant is required'
        }
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