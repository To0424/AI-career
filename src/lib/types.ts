// Simple types for demo app
export interface User {
  id: string;
  email: string;
  user_type: 'high_school' | 'uni_postgrad';
  dse_scores?: { [subject: string]: string } | null;
  discipline?: string | null;
  created_at: string;
  updated_at?: string;
}

export type DSEScores = { [subject: string]: string };

export interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  discipline: string;
  location?: string;
  jobType?: string;
  category?: string;
  salary?: string;
  source?: string;
  url?: string;
  scam_score?: number;
  created_at?: string;
}

export interface Application {
  id: number;
  user_id: string;
  job_id: number;
  status: string;
  applied_at: string;
}

export interface ChatbotQuery {
  id: number;
  user_id: string;
  query: string;
  response: string;
  created_at: string;
}

export interface CompanyStats {
  company: string;
  response_rate: number;
  avg_response_time: string;
}