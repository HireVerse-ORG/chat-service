import { UserRole } from '@hireverse/service-common/dist/token/user/userPayload';
import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: { id: string; role: UserRole }[];
  lastMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: {
      type: [
        {
          _id: false,
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
      type: Schema.Types.ObjectId,
      ref: 'Message', 
      default: null,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
export default Conversation;
