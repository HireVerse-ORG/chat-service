import { injectable, inject } from "inversify";
import { ISocketManager } from "../interface/socket.manager.interface";
import AuthSocket from "../interface/socket.interface";
import TYPES from "../../../core/container/container.types";
import { ISocketService } from "../interface/socket.service.interface";

@injectable()
export abstract class BaseSocketController {
    @inject(TYPES.SocketManager) protected socketManager!: ISocketManager;
    // @inject(TYPES.SocketService) protected socketService!: ISocketService;


    public abstract handleConnection(socket: AuthSocket): void;

}
