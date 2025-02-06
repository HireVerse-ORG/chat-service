import { RPCServiceResponseDto } from "../dto/rpc.response.dto";

export interface IProfileService {
    getCompanyProfilesByidList: (ids: string[]) => Promise<RPCServiceResponseDto>;
    getSeekerProfilesByUserId: (userId: string) => Promise<RPCServiceResponseDto>;
    checkIsFollowing: (data: {followerId: string; followingId: string}) => Promise<RPCServiceResponseDto>;
}