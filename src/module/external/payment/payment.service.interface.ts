import { RPCServiceResponseDto } from "../dto/rpc.response.dto";

export interface IPaymentService {
    seekerCanMessage: (userId: string) => Promise<RPCServiceResponseDto>;
}