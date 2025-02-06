import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { ISocketManager } from "./interface/socket.manager.interface";
import AuthSocket from "./interface/socket.interface";

@injectable()
export class SocketController {
    @inject(TYPES.SocketManager) private socketManager!: ISocketManager;

    private socket!: AuthSocket;

    initialize(socket: AuthSocket) {
        if (!this.socket) {
            this.socket = socket;
        }
        this.setupRoutes(socket);
    }

    private setupRoutes(socket: AuthSocket) {
        socket.on('join', this.onJoin.bind(this));
    }

    private async onJoin(data: any) {
        console.log("user joined: ", this.socket.payload);
        console.log("data: ", data);

        try {
            const socketId = await this.socketManager.getSocketId(this.socket.payload?.userId!);
            console.log("user session: ", socketId);
        } catch (error) {
            console.error("Error fetching socket ID: ", error);
        }
    }
}
