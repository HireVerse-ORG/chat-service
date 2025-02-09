import { inject, injectable } from "inversify";
import { BaseSocketController } from "./base.socket.controller";
import AuthSocket from "../interface/socket.interface";
import TYPES from "../../../core/container/container.types";
import { IMessageService } from "../../Message/interfaces/message.service.interface";

@injectable()
export class RoomSocketController extends BaseSocketController {
    @inject(TYPES.MessageService) private messageService!: IMessageService;
    
    public handleConnection(socket: AuthSocket): void {
        this.setupRoutes(socket);
    }

    protected setupRoutes(socket: AuthSocket): void {
        socket.on('join-room', (data) => this.onJoinRoom(socket, data));
    }

    private async onJoinRoom(socket: AuthSocket, data: {roomId: string}) {
        try {
            socket.join(data.roomId);
            const read = await this.messageService.readAll(data.roomId, socket.payload?.userId!);
            // console.log({read});
        } catch (error) {
            // console.log(error);
        }
    }
}