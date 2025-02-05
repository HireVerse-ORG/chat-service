import { Application } from "express";
import { errorHandler, notFoundHandler } from "./errorHandler";

export function registerRoutes(app: Application, prefix = "/api/chats") {
    app.get(`${prefix}/health`, (req, res) => {
        res.json("Chat Server is healthy 🚀")
    })
    app.use(notFoundHandler);
    app.use(errorHandler);
}