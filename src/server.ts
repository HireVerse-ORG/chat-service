import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import ExpressServer from './app/express';
import { checkEnvVariables } from '@hireverse/service-common/dist/utils/envChecker';
import Database from './core/database';
import { StartSocketServer, StopSocketServer } from './socket';

(async () => {
    checkEnvVariables('DATABASE_URL', 'KAFKA_SERVER');

    const databaseUrl = process.env.DATABASE_URL!;
    const expressPort = process.env.EXPRESS_PORT || '5006';
    const socketPort = process.env.SOCKET_PORT || '7006';

    const db = new Database(databaseUrl);
    const expressServer = new ExpressServer();
   
    db.connect(); 
    expressServer.start(expressPort);
    StartSocketServer(socketPort);

    process.on('SIGINT', async () => {
        expressServer.stop();
        db.disconnect();
        StopSocketServer();
    });
    process.on("SIGTERM", () => {
        expressServer.stop();
        db.disconnect();
        StopSocketServer();
    });
})();