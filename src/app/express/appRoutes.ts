import { Application } from "express";
import { errorHandler, notFoundHandler } from "./errorHandler";
import { messageRoutes } from "../../module/Message/message.routes";
import { conversationRoutes } from "../../module/Conversation/conversation.routes";
import { meetingRoutes } from "../../module/meeting/meeting.routes";

export function registerRoutes(app: Application, prefix = "/api/chats") {
    app.get(`${prefix}/health`, (req, res) => {
        res.json("Chat Server is healthy 🚀")
    })
    app.use(`${prefix}/messages`, messageRoutes);
    app.use(`${prefix}/conversations`, conversationRoutes);
    app.use(`${prefix}/meeting`, meetingRoutes);
    app.use(notFoundHandler);
    app.use(errorHandler);
}