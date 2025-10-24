import { storage } from '../lib/demoData';
import type { Application, Job } from '../lib/types';
import { jobService } from './jobService';

export interface ApplicationWithJob extends Application {
  job: Job;
}

export const applicationService = {
  async getUserApplications(userId: string): Promise<ApplicationWithJob[]> {
    try {
      const applications = storage.getApplications().filter((app: Application) => app.user_id === userId);
      const applicationsWithJobs: ApplicationWithJob[] = [];

      for (const app of applications) {
        const job = await jobService.getJobById(app.job_id);
        if (job) {
          applicationsWithJobs.push({ ...app, job });
        }
      }

      return applicationsWithJobs;
    } catch (error) {
      console.error('Error getting user applications:', error);
      return [];
    }
  },

  async createApplication(userId: string, jobId: number): Promise<Application | null> {
    try {
      const applications = storage.getApplications();
      
      // Check if application already exists
      const existing = applications.find((app: Application) => 
        app.user_id === userId && app.job_id === jobId
      );
      if (existing) return existing;

      const newApplication: Application = {
        id: applications.length + 1,
        user_id: userId,
        job_id: jobId,
        status: 'Applied',
        applied_at: new Date().toISOString()
      };

      applications.push(newApplication);
      storage.saveApplications(applications);

      return newApplication;
    } catch (error) {
      console.error('Error creating application:', error);
      return null;
    }
  },

  async updateApplicationStatus(applicationId: number, status: string): Promise<Application | null> {
    try {
      const applications = storage.getApplications();
      const appIndex = applications.findIndex((app: Application) => app.id === applicationId);
      
      if (appIndex >= 0) {
        applications[appIndex].status = status;
        storage.saveApplications(applications);
        return applications[appIndex];
      }

      return null;
    } catch (error) {
      console.error('Error updating application status:', error);
      return null;
    }
  },

  async hasApplied(userId: string, jobId: number): Promise<boolean> {
    try {
      const applications = storage.getApplications();
      return applications.some((app: Application) => 
        app.user_id === userId && app.job_id === jobId
      );
    } catch (error) {
      return false;
    }
  },
};
