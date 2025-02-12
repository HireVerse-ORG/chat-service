import { Router } from "express";
import container from "../../core/container";
import TYPES from "../../core/container/container.types";
import {allowedRoles} from "@hireverse/service-common/dist/token/user/userMiddleware";
import { MeetingController } from "./meeting.controller";

const controller = container.get<MeetingController>(TYPES.MeetingController);

// base: /api/chats/meeting
const router = Router();

router.post('/start-interview', allowedRoles('company'), controller.startInterview);

export const meetingRoutes = router;