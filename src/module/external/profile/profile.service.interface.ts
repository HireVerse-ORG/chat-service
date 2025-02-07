import { RPCServiceResponseDto } from "../dto/rpc.response.dto";

export interface IProfileService {
    getSeekerProfilesByUserId: (userId: string) => Promise<RPCServiceResponseDto>;
    getCompanyProfileByUserId: (userId: string) => Promise<RPCServiceResponseDto>;
    checkIsFollowing: (data: {followerId: string; followingId: string}) => Promise<RPCServiceResponseDto>;
}