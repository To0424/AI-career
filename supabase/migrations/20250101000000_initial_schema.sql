/*
  # AI Career Planner - Initial Database Schema

  ## Overview
  Creates the complete database schema for the AI Career Planner prototype application
  targeting high school (DSE) and university/postgraduate students.

  ## 1. New Tables

  ### users
  - `id` (uuid, primary key) - Unique user identifier
  - `email` (text, unique) - User email address
  - `user_type` (text) - Either 'high_school' or 'uni_postgrad'
  - `dse_scores` (jsonb, nullable) - DSE subject scores for high school users
  - `discipline` (text, nullable) - Selected discipline for uni/postgrad users
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### jobs
  - `id` (bigserial, primary key) - Unique job identifier
  - `title` (text) - Job title
  - `company` (text) - Company name
  - `source` (text) - Job source (JobsDB, LinkedIn, CTgoodjobs, Openjobs)
  - `url` (text) - External job posting URL
  - `description` (text) - Full job description
  - `discipline` (text) - Target discipline/category
  - `scam_score` (numeric) - Scam risk score (0.0 to 1.0)
  - `created_at` (timestamptz) - Job posting timestamp

  ### applications
  - `id` (bigserial, primary key) - Unique application identifier
  - `user_id` (uuid, foreign key) - Reference to users table
  - `job_id` (bigint, foreign key) - Reference to jobs table
  - `status` (text) - Application status (Applied, Interview, Rejected, etc.)
  - `applied_at` (timestamptz) - Application submission timestamp

  ### crowdsourced_stats
  - `id` (bigserial, primary key) - Unique stat identifier
  - `company` (text, unique) - Company name
  - `response_rate` (integer) - Response rate percentage
  - `avg_response_time` (text) - Average response time description
  - `created_at` (timestamptz) - Stat creation timestamp

  ### chatbot_queries
  - `id` (bigserial, primary key) - Unique query identifier
  - `user_id` (uuid, foreign key) - Reference to users table
  - `query` (text) - User's chatbot query
  - `response` (text) - Chatbot's response
  - `created_at` (timestamptz) - Query timestamp

  ## 2. Security

  - Enable RLS on all tables
  - Users can only access their own data
  - Jobs and crowdsourced_stats are publicly readable
  - Applications are only accessible to the owning user
  - Chatbot queries are only accessible to the owning user

  ## 3. Important Notes

  - DSE scores stored as JSONB for flexible subject/grade pairs
  - Scam score uses numeric type for precise decimal values
  - All timestamps use timestamptz for proper timezone handling
  - Foreign key constraints ensure referential integrity
  - Indexes added for common query patterns
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('high_school', 'uni_postgrad')),
  dse_scores jsonb,
  discipline text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  company text NOT NULL,
  source text NOT NULL CHECK (source IN ('JobsDB', 'LinkedIn', 'CTgoodjobs', 'Openjobs')),
  url text NOT NULL,
  description text NOT NULL,
  discipline text NOT NULL,
  scam_score numeric(3,2) DEFAULT 0.0 CHECK (scam_score >= 0 AND scam_score <= 1),
  created_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id bigint NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status text DEFAULT 'Applied' NOT NULL,
  applied_at timestamptz DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Create crowdsourced_stats table
CREATE TABLE IF NOT EXISTS crowdsourced_stats (
  id bigserial PRIMARY KEY,
  company text UNIQUE NOT NULL,
  response_rate integer CHECK (response_rate >= 0 AND response_rate <= 100),
  avg_response_time text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create chatbot_queries table
CREATE TABLE IF NOT EXISTS chatbot_queries (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query text NOT NULL,
  response text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_queries_user_id ON chatbot_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_discipline ON jobs(discipline);
CREATE INDEX IF NOT EXISTS idx_jobs_scam_score ON jobs(scam_score);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE crowdsourced_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_queries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for jobs table (publicly readable)
CREATE POLICY "Anyone can view jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for applications table
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON applications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for crowdsourced_stats table (publicly readable)
CREATE POLICY "Anyone can view crowdsourced stats"
  ON crowdsourced_stats FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for chatbot_queries table
CREATE POLICY "Users can view own chatbot queries"
  ON chatbot_queries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chatbot queries"
  ON chatbot_queries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
