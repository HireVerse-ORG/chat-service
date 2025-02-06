import { UserRole } from "@hireverse/service-common/dist/token/user/userPayload";

export interface ConversationDTO {
    id: string;
    participants: { id: string; role: UserRole }[];
    lastMessage: { text: string; sentAt: Date } | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateConversationDTO {
    participants: { id: string; role: UserRole }[];
}

export interface UpdateConversationLastMessageDTO {
    id: string;
    lastMessage: { text: string; sentAt: Date };
}