import { DEMO_JOBS } from '../lib/demoData';
import type { Job } from '../lib/types';

export const jobService = {
  async getJobs(userType?: 'high_school' | 'uni_postgrad', discipline?: string | null): Promise<Job[]> {
    try {
      let jobs = [...DEMO_JOBS];

      // Simple filtering based on user type and discipline
      if (userType === 'high_school') {
        // Show internships and entry-level positions for high school students
        jobs = jobs.filter(job => 
          job.title.toLowerCase().includes('intern') || 
          job.title.toLowerCase().includes('junior') ||
          job.discipline === 'Education'
        );
      } else if (userType === 'uni_postgrad') {
        // For university students, show more inclusive results
        if (discipline) {
          // Show jobs matching discipline OR general professional roles
          jobs = jobs.filter(job => 
            job.discipline === discipline || 
            job.discipline === 'Tech' || // Tech is always relevant
            job.discipline === 'Business' || // Business is broadly applicable
            !job.title.toLowerCase().includes('intern') // Exclude internships for uni students
          );
        } else {
          // If no discipline specified, show all non-internship positions
          jobs = jobs.filter(job => !job.title.toLowerCase().includes('intern'));
        }
      }

      console.log('Filtered jobs for', userType, 'with discipline', discipline, ':', jobs);
      return jobs;
    } catch (error) {
      console.error('Error getting jobs:', error);
      return DEMO_JOBS;
    }
  },

  async getJobById(jobId: number): Promise<Job | null> {
    try {
      return DEMO_JOBS.find(job => job.id === jobId) || null;
    } catch (error) {
      console.error('Error getting job by ID:', error);
      return null;
    }
  },

  async searchJobs(searchTerm: string, userType?: 'high_school' | 'uni_postgrad', discipline?: string | null): Promise<Job[]> {
    const allJobs = await this.getJobs(userType, discipline);

    if (!searchTerm.trim()) {
      return allJobs;
    }

    const lowerSearch = searchTerm.toLowerCase();
    return allJobs.filter(job =>
      job.title.toLowerCase().includes(lowerSearch) ||
      job.company.toLowerCase().includes(lowerSearch) ||
      job.description.toLowerCase().includes(lowerSearch)
    );
  }
};
