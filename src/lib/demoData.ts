import { Job, CompanyStats } from './types';

// Simple hardcoded job data with diverse sources
export const DEMO_JOBS: Job[] = [
  {
    id: 1,
    title: "Intern - IT",
    company: "Quam Plus International Financial Limited",
    description: "Assist in developing and integrating AI and web-based applications under supervision. Collect and document user requirements and assist in designing application structures.",
    discipline: "Tech",
    location: "Hong Kong Island",
    jobType: "Part time",
    category: "Help Desk & IT Support",
    source: "JobsDB",
    url: "https://example.com/job1",
    scam_score: 0.1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Junior Software Developer",
    company: "Mastermind Asia Limited",
    description: "Working with the team to develop a high performance and scalable blockchain including storage design, consensus algorithm etc.",
    discipline: "Tech",
    location: "Central, Central and Western District",
    jobType: "Full time",
    category: "Engineering - Software",
    source: "JobsDB",
    url: "https://example.com/job2",
    scam_score: 0.1,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Teacher of Mathematics / Computer Science",
    company: "NTK Academic Group Limited",
    description: "Teach with passion and nurture students' full potential through academically rigorous instructions. Devise customized lesson plans for students.",
    discipline: "Education",
    location: "Causeway Bay, Wan Chai District",
    jobType: "Full time",
    category: "Tutoring",
    salary: "$21,000 – $30,000 per month",
    source: "JobsDB",
    url: "https://example.com/job3",
    scam_score: 0.05,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "AI Researcher (Insurtech)",
    company: "MediConCen Limited",
    description: "Work in a young and energetic team to develop AI & mobile applications for healthcare related projects. Work on artificial intelligence and machine learning projects.",
    discipline: "Tech",
    location: "San Po Kong, Wong Tai Sin District",
    jobType: "Full time",
    category: "Developers/Programmers",
    source: "JobsDB",
    url: "https://example.com/job4",
    scam_score: 0.08,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    title: "Frontend Developer",
    company: "Tech Innovation Ltd",
    description: "Develop modern web applications using React, TypeScript, and other cutting-edge frontend technologies.",
    discipline: "Tech",
    location: "Tsim Sha Tsui",
    jobType: "Full time",
    category: "Frontend Development",
    source: "JobsDB",
    url: "https://example.com/job5",
    scam_score: 0.03,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    title: "Business Analyst",
    company: "Corporate Solutions Ltd",
    description: "Analyze business processes and requirements to improve organizational efficiency. Work with stakeholders to gather requirements.",
    discipline: "Business",
    location: "Central",
    jobType: "Full time",
    category: "Business Analysis",
    source: "JobsDB",
    url: "https://example.com/job6",
    scam_score: 0.12,
    created_at: new Date().toISOString()
  }
];

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