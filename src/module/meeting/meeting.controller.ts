import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { IMeetingService } from "./interfaces/meeting.service.interface";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { AuthRequest } from "@hireverse/service-common/dist/token/user/userRequest";
import { IJobService } from "../external/job/job.service.interface";
import { Response } from "express";

@injectable()
export class MeetingController {
    @inject(TYPES.MeetingService) private meesageService!: IMeetingService;
    @inject(TYPES.JobService) private jobService!: IJobService;

    /**
    * @route POST /api/chats/meeting/start-interview
    * @scope Company
    **/
    public startInterview = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const {interviewId} = req.body;
        try {
            const {response} = await this.jobService.getInterviewFromId(interviewId);
            if(!response.interview){
                return res.status(404).json({message: "Interview not found"});
            }

            const interview = response.interview;

            console.log({interview});
            
            if(interview.type !== "online"){
                return res.status(400).json({message: "Interview must be online"});
            }

            if(interview.status !== "accepted"){
                return res.status(400).json({message: "Interview not accepted"});
            }

            const meeting = await this.meesageService.createMeeting(interview.interviewerId, [interview.applicantId]);
            console.log({meeting});
            return res.json(meeting);
        } catch (error) {
            console.log(error);
            return res.status(400).json({message: "Failed to start meeting"});
        }
    });
}