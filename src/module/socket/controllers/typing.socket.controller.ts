import { injectable } from "inversify";
import { BaseSocketController } from "./base.socket.controller";
import AuthSocket from "../interface/socket.interface";

@injectable()
export class TypingSocketController extends BaseSocketController {    
    public handleConnection(socket: AuthSocket): void {
        this.setupRoutes(socket);
    }

    protected setupRoutes(socket: AuthSocket): void {
        socket.on('typing', (data) => this.onTyping(socket, data));
    }

    private onTyping(socket: AuthSocket, data: {roomId: string, isTyping: boolean}): void {
        const {roomId, isTyping} = data;
        if(!socket.rooms.has(roomId)) return;
        socket.to(data.roomId).emit('typing-status', {userId: socket.payload?.userId, isTyping});
    }
}