import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { IMessageService } from "./interfaces/message.service.interface";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { AuthRequest } from "@hireverse/service-common/dist/token/user/userRequest";
import { Response } from "express";

@injectable()
export class MessageController {
    @inject(TYPES.MessageService) private meesageService!: IMessageService;

    /**
    * @route GET /api/chats/messages/list/:conversationId?page=&limit
    * @scope Private
    **/
    public listMessages = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const conversationId = req.params.conversationId;

        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        
        const messages = this.meesageService.listMessagesByConversation(conversationId, page, limit);
        return res.json(messages)
    });
}