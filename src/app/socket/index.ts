import http from 'http';
import { Server } from 'socket.io';
import { logger } from '../../core/utils/logger';
import container from '../../core/container';
import { SocketService } from '../../module/socket/socket.service';
import TYPES from '../../core/container/container.types';

const httpServer = http.createServer();

const socketServer = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

const StartSocketServer = (PORT: string) => {
    httpServer.listen(PORT, () => {
        logger.info(`WebSocket Server running on port ${PORT}`);
    });
    const socketService = container.get<SocketService>(TYPES.SocketService);
    socketService.initialize(socketServer);
}

const StopSocketServer = () => {
    logger.info('Shutting down WebSocket Server...');
    socketServer.close(() => {
        logger.info('WebSocket Server shut down gracefully.');
    });
}

export { socketServer, StartSocketServer, StopSocketServer} 