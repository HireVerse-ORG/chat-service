import { Router } from "express";
import container from "../../core/container";
import TYPES from "../../core/container/container.types";
import { MessageController } from "./message.controller";
import {isAuthenticated} from "@hireverse/service-common/dist/token/user/userMiddleware";

const controller = container.get<MessageController>(TYPES.MessageController);

// base: /api/chats/messages
const router = Router();

router.get('/list/:conversationId', isAuthenticated, controller.listMessages);

export const messageRoutes = router;