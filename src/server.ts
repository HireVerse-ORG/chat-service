import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import ExpressServer from './app/express';
import GrpcServer from './app/grpc';
import { checkEnvVariables } from '@hireverse/service-common/dist/utils/envChecker';
import Database from './core/database';
import { StartSocketServer, StopSocketServer } from './app/socket';

(async () => {
    checkEnvVariables('DATABASE_URL', 'PROFILE_SERVICE_URL', 'PAYMENT_SERVICE_URL');

    const databaseUrl = process.env.DATABASE_URL!;
    const expressPort = process.env.EXPRESS_PORT || '5006';
    const socketPort = process.env.SOCKET_PORT || '7006';
    const grpcPort = process.env.GRPC_PORT || '6006';

    const db = new Database(databaseUrl);
    const expressServer = new ExpressServer();
    const grpcServer = new GrpcServer();

   
    db.connect(); 
    expressServer.start(expressPort);
    StartSocketServer(socketPort);
    grpcServer.start(grpcPort);

    process.on('SIGINT', async () => {
        expressServer.stop();
        grpcServer.close();
        StopSocketServer();
        db.disconnect();
    });
    process.on("SIGTERM", () => {
        expressServer.stop();
        grpcServer.close();
        StopSocketServer();
        db.disconnect();
    });
})();