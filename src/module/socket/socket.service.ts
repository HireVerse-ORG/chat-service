import { Server, Socket } from "socket.io";
import { ISocketService } from "./interface/socket.service.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { ISocketManager } from "./interface/socket.manager.interface";
import { tokenService } from "../../core/utils/token";
import { logger } from "../../core/utils/logger";
import AuthSocket from "./interface/socket.interface";
import { MessageSocketController } from "./controllers/message.socket.controller";
import { RoomSocketController } from "./controllers/room.socket.controller";

@injectable()
export class SocketService implements ISocketService {
    @inject(TYPES.SocketManager) private socketManager!: ISocketManager;
    @inject(TYPES.MessageSocketController) private MessageSocketController!: MessageSocketController;
    @inject(TYPES.RoomSocketController) private RoomSocketController!: RoomSocketController;

    private io!: Server;

    initialize(io: Server) {
        if (!this.io) {
            this.io = io;
            this.setupListeners();
        }
    }

    private setupListeners() {
        this.io.on("connection", async (socket: AuthSocket) => {
            const { token } = socket.handshake.query as { token: string };
    
            try {
                const payload = tokenService.verifyToken(token);
                const { userId } = payload;
                await this.socketManager.addUser(userId, socket.id);
                socket.payload = payload;

                this.RoomSocketController.handleConnection(socket);
                this.MessageSocketController.handleConnection(socket);

                socket.on("disconnect", async () => {
                    try {
                        await this.socketManager.removeUser(socket.id);
                    } catch (error) {
                        logger.error('Error during chat socket disconnect:', error);
                    }
                });
    
            } catch (error) {
                socket.disconnect(); 
            }
        });
    }
    

    emit(event: string, data: any, room?: string): void {
        if (room) {
            this.io.to(room).emit(event, data);
        } else {
            this.io.emit(event, data);
        }
    }

    on(event: string, callback: (socket: Socket, data: any) => void): void {
        this.io.on("connection", (socket: Socket) => {
            socket.on(event, (data) => callback(socket, data));
        });
    }
}
