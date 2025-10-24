export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          user_type: 'high_school' | 'uni_postgrad'
          dse_scores: Json | null
          discipline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          user_type: 'high_school' | 'uni_postgrad'
          dse_scores?: Json | null
          discipline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          user_type?: 'high_school' | 'uni_postgrad'
          dse_scores?: Json | null
          discipline?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: number
          title: string
          company: string
          source: 'JobsDB' | 'LinkedIn' | 'CTgoodjobs' | 'Openjobs'
          url: string
          description: string
          discipline: string
          scam_score: number
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          company: string
          source: 'JobsDB' | 'LinkedIn' | 'CTgoodjobs' | 'Openjobs'
          url: string
          description: string
          discipline: string
          scam_score?: number
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          company?: string
          source?: 'JobsDB' | 'LinkedIn' | 'CTgoodjobs' | 'Openjobs'
          url?: string
          description?: string
          discipline?: string
          scam_score?: number
          created_at?: string
        }
      }
      applications: {
        Row: {
          id: number
          user_id: string
          job_id: number
          status: string
          applied_at: string
        }
        Insert: {
          id?: number
          user_id: string
          job_id: number
          status?: string
          applied_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          job_id?: number
          status?: string
          applied_at?: string
        }
      }
      crowdsourced_stats: {
        Row: {
          id: number
          company: string
          response_rate: number
          avg_response_time: string
          created_at: string
        }
        Insert: {
          id?: number
          company: string
          response_rate: number
          avg_response_time: string
          created_at?: string
        }
        Update: {
          id?: number
          company?: string
          response_rate?: number
          avg_response_time?: string
          created_at?: string
        }
      }
      chatbot_queries: {
        Row: {
          id: number
          user_id: string
          query: string
          response: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          query: string
          response: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          query?: string
          response?: string
          created_at?: string
        }
      }
    }
  }
}

export type UserType = 'high_school' | 'uni_postgrad';
export type JobSource = 'JobsDB' | 'LinkedIn' | 'CTgoodjobs' | 'Openjobs';
export type Discipline = 'Tech' | 'Business' | 'Arts' | 'Science' | 'Internship' | 'General';

export interface DSEScores {
  [subject: string]: string;
}

export interface User {
  id: string;
  email: string;
  user_type: UserType;
  dse_scores: DSEScores | null;
  discipline: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  source: JobSource;
  url: string;
  description: string;
  discipline: string;
  scam_score: number;
  created_at: string;
}

export interface Application {
  id: number;
  user_id: string;
  job_id: number;
  status: string;
  applied_at: string;
}

export interface CrowdsourcedStat {
  id: number;
  company: string;
  response_rate: number;
  avg_response_time: string;
  created_at: string;
}

export interface ChatbotQuery {
  id: number;
  user_id: string;
  query: string;
  response: string;
  created_at: string;
}
