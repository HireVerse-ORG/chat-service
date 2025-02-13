import { inject, injectable } from "inversify";
import { BaseSocketController } from "./base.socket.controller";
import AuthSocket from "../interface/socket.interface";
import TYPES from "../../../core/container/container.types";
import { IMeetingService } from "../../meeting/interfaces/meeting.service.interface";

@injectable()
export class MeetingSocketController extends BaseSocketController {
    @inject(TYPES.MeetingService) private meetingService!: IMeetingService; 

    public handleConnection(socket: AuthSocket): void {
        this.setupRoutes(socket);
    }

    protected setupRoutes(socket: AuthSocket): void {
        socket.on('join-meeting', (data) => this.onJoinMeeting(socket, data));
        socket.on('signal', (data) => this.onSignal(socket, data));
        socket.on('leave-meeting', (data) => this.onLeaveMeeting(socket, data));
        socket.on('mute-changed', (data) => this.onMuteChanged(socket, data));
        socket.on('video-state-changed', (data) => this.onVideStateChanged(socket, data));
        socket.on('end-meeting', (data) => this.onEndMeeting(socket, data));
    }

    async onJoinMeeting(socket: AuthSocket, data: {roomId: string}) {
        const userId = socket.payload?.userId!;
        const {roomId} = data;
        const canJoin = await this.meetingService.validateParticipant(roomId, userId);
        if(canJoin){
            socket.join(roomId);
            socket.to(roomId).emit('user-joined', {userId});
        }
    }

    async onSignal(socket: AuthSocket, data: { signal: any, to: string }) {
        const fromUserId = socket.payload?.userId;
        const { signal, to } = data;

        const toSocket = await this.socketManager.getSocketId(to);
        if(toSocket){
            socket.to(toSocket).emit('signal', { signal, from: fromUserId });
        }
    }

    onLeaveMeeting(socket: AuthSocket, data: {roomId: string}) {
        const userId = socket.payload?.userId!;
        socket.leave(data.roomId);
        socket.to(data.roomId).emit("user-left", {userId});
    }

    onMuteChanged(socket: AuthSocket, data: { muted: boolean, roomId: string }) {
        const userId = socket.payload?.userId!;
        const {roomId, muted} = data;
        socket.to(roomId).emit("mute-changed", {userId, muted});
    }

    onVideStateChanged(socket: AuthSocket, data: { videoState: boolean, roomId: string }) {
        const userId = socket.payload?.userId!;
        const {roomId, videoState} = data;
        socket.to(roomId).emit("video-state-changed", {userId, videoState});
    }

    async onEndMeeting(socket: AuthSocket, data: {roomId: string}) {
        try {
            await this.meetingService.endMeeting(data.roomId);
            socket.leave(data.roomId);
            socket.to(data.roomId).emit("meeting-ended");
        } catch (error) {
            
        }
    }
}