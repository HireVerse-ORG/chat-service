import { RPCServiceResponseDto } from "../dto/rpc.response.dto";

export interface IJobService {
    getInterviewFromId(id: string): Promise<RPCServiceResponseDto>;
}