import {CompanyProfileClient, SeekerProfileClient, FollowerClient} from '@hireverse/service-protos/dist/clients/profile-client';
import {SeekerPaymentClient} from '@hireverse/service-protos/dist/clients/payment-client';
import {JobsInterviewServiceClient} from '@hireverse/service-protos/dist/clients/job-client';

export const companyProfileClient = CompanyProfileClient(process.env.PROFILE_SERVICE_URL!);
export const seekerProfileClient = SeekerProfileClient(process.env.PROFILE_SERVICE_URL!);
export const followerClient = FollowerClient(process.env.PROFILE_SERVICE_URL!);

export const seekerPaymentClient = SeekerPaymentClient(process.env.PAYMENT_SERVICE_URL!);

export const jobsInterviewClient = JobsInterviewServiceClient(process.env.JOB_SERVICE_URL!);