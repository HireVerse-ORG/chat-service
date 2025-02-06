import { Router } from "express";
import container from "../../core/container";
import TYPES from "../../core/container/container.types";
import {isAuthenticated} from "@hireverse/service-common/dist/token/user/userMiddleware";
import { ConversationController } from "./conversation.controller";

const controller = container.get<ConversationController>(TYPES.ConversationController);

// base: /api/chats/conversations
const router = Router();

router.get('/list', isAuthenticated, controller.listConversations);
router.get('/details', isAuthenticated, controller.getConversationDetails);

router.post('/start', isAuthenticated, controller.startConversation);

export const conversationRoutes = router;