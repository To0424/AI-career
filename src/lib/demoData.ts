import { Job, CompanyStats } from './types';
import jobsData from '../data/jobs.json';

export const DEMO_JOBS: Job[] = jobsData.map(job => ({
  ...job,
  created_at: new Date().toISOString()
}));

// Simple company stats
export const COMPANY_STATS: CompanyStats[] = [
  { company: "Quam Plus International Financial Limited", response_rate: 0.72, avg_response_time: "4 days" },
  { company: "Mastermind Asia Limited", response_rate: 0.58, avg_response_time: "7 days" },
  { company: "NTK Academic Group Limited", response_rate: 0.81, avg_response_time: "3 days" },
  { company: "MediConCen Limited", response_rate: 0.64, avg_response_time: "6 days" },
  { company: "Tech Innovation Ltd", response_rate: 0.69, avg_response_time: "5 days" }
];

// Simple storage helpers
export const storage = {
  getUsers: () => JSON.parse(localStorage.getItem('demo_users') || '[]'),
  saveUsers: (users: any[]) => localStorage.setItem('demo_users', JSON.stringify(users)),
  getApplications: () => JSON.parse(localStorage.getItem('demo_applications') || '[]'),
  saveApplications: (applications: any[]) => localStorage.setItem('demo_applications', JSON.stringify(applications)),
  getChatQueries: () => JSON.parse(localStorage.getItem('demo_chat_queries') || '[]'),
  saveChatQueries: (queries: any[]) => localStorage.setItem('demo_chat_queries', JSON.stringify(queries))
};