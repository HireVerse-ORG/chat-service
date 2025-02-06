import { injectable } from "inversify";
import { IPaymentService } from "./payment.service.interface";
import { RPCServiceResponseDto } from "../dto/rpc.response.dto";
import { mapGrpcErrorToHttpStatus } from "@hireverse/service-common/dist/utils";
import { seekerPaymentClient } from "../../../core/rpc/clients";

@injectable()
export class PaymentService implements IPaymentService {

    async seekerCanMessage(userId: string): Promise<RPCServiceResponseDto> {
        return new Promise((resolve, reject) => {
            seekerPaymentClient.SeekerCanMessage({ userId }, (error: any | null, response: any) => {
                if (error) {
                    const status = mapGrpcErrorToHttpStatus(error);
                    const message = error.details;
                    return reject({ status, message, response });
                }

                return resolve({ status: 200, message: "Rpc Called", response });
            })
        })
    }
}