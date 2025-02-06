import { UserPayload } from "@hireverse/service-common/dist/token/user/userPayload";
import { Socket } from "socket.io";

interface AuthSocket extends Socket {
    payload?: UserPayload;  
}

export default AuthSocket;
