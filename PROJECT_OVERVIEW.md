# AI Career Planner - Project Overview

## What Was Built

A fully functional career planning web application for Hong Kong students, featuring job aggregation, personalized recommendations, scam detection, application tracking, and an AI-powered chatbot.

## Key Features

### 1. User Onboarding
- Two-step modal flow for user type selection
- High school students input DSE scores across core and elective subjects
- University/postgraduate students select their discipline
- All data stored securely in Supabase

### 2. Job Listings (Homepage)
- Curated job feed filtered by user type and discipline
- High school students see internship opportunities
- University students see jobs matching their discipline
- Real-time search functionality by job title and company
- Visual scam warnings for suspicious listings
- Source badges (JobsDB, LinkedIn, CTgoodjobs, Openjobs)

### 3. Job Details
- Complete job information with company details
- Prominent scam warnings for high-risk postings (scam_score > 0.5)
- Crowdsourced company statistics (response rate, average response time)
- One-click application that opens external job posting
- Automatic application tracking for university/postgrad users

### 4. Dashboard
- **High School Students:**
  - Display of DSE scores by subject
  - Personalized study suggestions based on performance
  - Recommendations for universities and educational pathways

- **University/Postgrad Students:**
  - Complete application history with status tracking
  - Table view showing job title, company, source, status, and application date
  - Profile editing to update discipline

### 5. AI Career Chatbot
- Fixed widget accessible from all pages
- Context-aware responses based on user type
- **High School:** DSE advice, overseas study guidance, mental health support
- **University/Postgrad:** CV writing tips, interview prep, networking strategies
- 3-query limit per session with visual counter
- Chat history showing last 2 interactions

## Technical Architecture

### Frontend
- **Framework:** React 18 with TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Build Tool:** Vite

### Backend & Database
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Anonymous Auth
- **Security:** Row Level Security (RLS) on all tables
- **Real-time:** Supabase real-time capabilities (available for future enhancements)

### Database Schema
- **users** - User profiles with DSE scores or discipline
- **jobs** - Job listings with scam scores
- **applications** - Application tracking
- **crowdsourced_stats** - Company response statistics
- **chatbot_queries** - Chat history and query limit tracking

## File Structure

```
src/
├── lib/
│   ├── supabase.ts              # Supabase client configuration
│   ├── database.types.ts         # TypeScript type definitions
│   └── initDatabase.ts           # Database initialization reference
├── services/
│   ├── userService.ts            # User CRUD operations
│   ├── jobService.ts             # Job fetching and filtering
│   ├── applicationService.ts     # Application tracking
│   ├── crowdsourcedStatsService.ts # Company statistics
│   └── chatbotService.ts         # Chatbot logic and responses
├── components/
│   ├── OnboardingModal.tsx       # User onboarding flow
│   ├── JobCard.tsx               # Job listing card component
│   └── ChatbotWidget.tsx         # Fixed chatbot interface
├── pages/
│   ├── HomePage.tsx              # Main job listing page
│   ├── JobDetailsPage.tsx        # Individual job details
│   └── DashboardPage.tsx         # User profile and applications
└── App.tsx                       # Main app with routing
```

## Design Principles

### User Experience
- Clean, professional interface with neutral color palette
- Intuitive navigation with clear visual hierarchy
- Responsive design works on mobile, tablet, and desktop
- Loading states for all async operations
- Accessible form controls and interactive elements

### Security
- All database tables protected with RLS
- Users can only access their own data
- Jobs and stats are publicly readable
- Anonymous authentication for prototype simplicity
- No sensitive data exposed in client-side code

### Performance
- Optimized database queries with proper indexing
- Efficient filtering and search on client-side
- Component-level code splitting with React Router
- Production build optimizations via Vite

## Seeded Data

### Jobs (10 listings)
- 3 Tech/STEM positions
- 2 Business roles
- 2 Internships
- 1 Science position
- 1 Arts internship
- 2 High-risk scam examples for testing

### Company Statistics (5 entries)
- Response rates ranging from 65% to 85%
- Average response times from 3 days to 2 weeks

## How to Use

### Initial Setup
1. Run database migrations (see DATABASE_SETUP.md)
2. Start the development server: `npm run dev`
3. Application will auto-authenticate anonymously

### User Flows

**High School Student:**
1. Select "High School Student" in onboarding
2. Enter DSE scores for 4 core subjects + 2 electives
3. Browse internship opportunities on homepage
4. Use chatbot for DSE advice and university planning
5. View personalized study suggestions on dashboard

**University/Postgrad Student:**
1. Select "University/Postgrad Student" in onboarding
2. Choose discipline (Tech, Business, Arts, Science, General)
3. Browse jobs filtered by discipline
4. Click job to view details and apply
5. Applications automatically tracked in dashboard
6. Use chatbot for CV and interview tips

## Future Enhancements

Potential features for future development:
- Email notifications for application updates
- Advanced filtering (salary range, location, experience level)
- Resume upload and parsing
- Job recommendations based on application history
- Real-time company reviews and ratings
- Integration with actual job board APIs
- Multi-language support (English, Traditional Chinese)
- Calendar integration for interview scheduling

## Notes

- Database tables must be created manually via Supabase SQL Editor
- Anonymous authentication means each browser session is a new user
- Chatbot uses keyword matching (not true AI/LLM)
- Job URLs are placeholder links for demonstration
- Scam detection is based on hardcoded scores (not ML model)

## Support

For issues or questions:
1. Check DATABASE_SETUP.md for database configuration
2. Verify environment variables in .env
3. Review browser console for error messages
4. Check Supabase dashboard for RLS policy issues
