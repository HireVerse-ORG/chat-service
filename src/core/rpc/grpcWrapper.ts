import * as grpc from '@grpc/grpc-js';
import { ApplicationError, InternalError } from "@hireverse/service-common/dist/app.errors";
import { mapErrorToGrpcStatus } from "@hireverse/service-common/dist/utils/helper";
import { logger } from '../utils/logger';

export function grpcWrapper(controller: Function) {
    return async (call: any, callback: any) => {
        try {
            await controller(call, callback);
        } catch (error) {
            if (error instanceof InternalError) {
                logger.error(`Internal Error: ${error.message}`);
            }

            let message = "An error occurred while processing the request.";
            let code = grpc.status.INTERNAL;

            if (error instanceof ApplicationError) {
                message = error.message;
                code = mapErrorToGrpcStatus(error);
            }


            callback({ code, details: message }, null);
        }
    };
}