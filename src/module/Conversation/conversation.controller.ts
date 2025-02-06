import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { AuthRequest } from "@hireverse/service-common/dist/token/user/userRequest";
import { Response } from "express";
import { IConversationService } from "./interfaces/conversation.service.interface";

@injectable()
export class ConversationController {
    @inject(TYPES.ConversationService) private conversationService!: IConversationService;

    /**
    * @route GET /api/chats/conversations/list?page=&limit
    * @scope Private
    **/
    public listConversations = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload?.userId!;
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        
        const conversations = await this.conversationService.listConversationsByParticiPantId(userId, page, limit);

        const participantsIds = conversations.data.forEach(c => {
            return c.participants.filter(p => p.id != userId);
        })

        // want to fetch profile using that id
        
        return res.json(conversations)
    });
}