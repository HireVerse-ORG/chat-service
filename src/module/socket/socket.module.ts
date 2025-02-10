import { Container } from "inversify";
import { SocketService } from "./socket.service";
import { ISocketService } from "./interface/socket.service.interface";
import TYPES from "../../core/container/container.types";
import { SocketManager } from "./socket.manager";
import { ISocketManager } from "./interface/socket.manager.interface";
import { MessageSocketController } from "./controllers/message.socket.controller";
import { RoomSocketController } from "./controllers/room.socket.controller";
import { TypingSocketController } from "./controllers/typing.socket.controller";

 
export function loadSocketContainer(container: Container){
    container.bind<ISocketManager>(TYPES.SocketManager).to(SocketManager).inSingletonScope();    
    container.bind<ISocketService>(TYPES.SocketService).to(SocketService).inSingletonScope();    
    container.bind<MessageSocketController>(TYPES.MessageSocketController).to(MessageSocketController);    
    container.bind<RoomSocketController>(TYPES.RoomSocketController).to(RoomSocketController);    
    container.bind<TypingSocketController>(TYPES.TypingSocketController).to(TypingSocketController);    
}