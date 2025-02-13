import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { IMeetingService } from "./interfaces/meeting.service.interface";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { AuthRequest } from "@hireverse/service-common/dist/token/user/userRequest";
import { IJobService } from "../external/job/job.service.interface";
import { Response } from "express";
import { IProfileService } from "../external/profile/profile.service.interface";

@injectable()
export class MeetingController {
    @inject(TYPES.MeetingService) private meesageService!: IMeetingService;
    @inject(TYPES.JobService) private jobService!: IJobService;
    @inject(TYPES.ProfileService) private profileService!: IProfileService;

    /**
    * @route POST /api/chats/meeting/start-interview
    * @scope Company
    **/
    public startInterview = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { interviewId } = req.body;
        try {
            const { response } = await this.jobService.getInterviewFromId(interviewId);
            if (!response.interview) {
                return res.status(404).json({ message: "Interview not found" });
            }

            const interview = response.interview;

            if (interview.type !== "online") {
                return res.status(400).json({ message: "Interview must be online" });
            }

            if (interview.status !== "accepted") {
                return res.status(400).json({ message: "Interview not accepted" });
            }

            const meeting = await this.meesageService.createMeeting(interview.interviewerId, [
                {id: interview.applicantId, role: "seeker"},
                {id: interview.interviewerId, role: "company"}
            ], interviewId);
            return res.json(meeting);

        } catch (error) {
            return res.status(400).json({ message: "Failed to start meeting" });
        }
    });

    /**
    * @route POST /api/chats/meeting/room/:roomId
    * @scope Company
    **/
    public getRoomDetails = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const roomId = req.params.roomId; 
        const room = await this.meesageService.getMeetingByRoomId(roomId);
        if(!room){
            return res.status(404).json({message: "Room not found"});
        }

        const profilePromises = room.participants.map(async (p) => {
            try {
                if (p.role === "company") {
                    const { response } = await this.profileService.getCompanyProfileByUserId(p.id);
                    return { id: p.id, profile: response.profile };
                } else if (p.role === "seeker") {
                    const { response } = await this.profileService.getSeekerProfilesByUserId(p.id);
                    return { id: p.id, profile: response.profile };
                } else {
                    return { id: p.id, profile: null };
                }
            } catch (error) {
                return { id: p.id, profile: null };
            }
        });

        const profileResults = await Promise.all(profilePromises);

        const profilesMap = new Map<string, any>();
        profileResults.forEach((result) => {
            if (result.profile) {
                profilesMap.set(result.id, result.profile);
            }
        });

        const participants = room.participants.map((p) => {
            const profile = profilesMap.get(p.id);
            return {
                id: p.id,
                role: p.role,
                displayName: profile.name || profile.profileName || "Unknown",
                image: profile.image,         
            }
        })

        return res.json({...room, participants});
    });
}