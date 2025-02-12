import { injectable } from "inversify";
import { IJobService } from "./job.service.interface";
import { RPCServiceResponseDto } from "../dto/rpc.response.dto";
import { jobsInterviewClient } from "../../../core/rpc/clients";
import { mapGrpcErrorToHttpStatus } from "@hireverse/service-common/dist/utils";

@injectable()
export class JobService implements IJobService {

    async getInterviewFromId(id: string): Promise<RPCServiceResponseDto> {
        return new Promise((resolve, reject) => {
            jobsInterviewClient.GetInterviewFromId({ id }, (error: any | null, response: any) => {
                if (error) {
                    const status = mapGrpcErrorToHttpStatus(error);
                    const message = error.details;
                    return reject({ status, message, response });
                }

                return resolve({ status: 200, message: "Interview fetched", response });
            })
        })
    }
}