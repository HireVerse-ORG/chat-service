import { UserRole } from '@hireverse/service-common/dist/token/user/userPayload';
import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: { id: string; role: UserRole }[];
  lastMessage: { text: string; sentAt: Date } | null;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: {
      type: [
        {
          id: String,
          role: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
      validate: [(val: any[]) => val.length >= 2, 'A conversation must have at least two participants'],
    },
    lastMessage: {
      type: {
        text: String,
        sentAt: Date,
      },
      default: null, 
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
export default Conversation;
