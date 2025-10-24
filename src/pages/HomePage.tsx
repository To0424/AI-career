import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, MessageCircle, Calculator, GraduationCap } from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { jobService } from '../services/jobService';
import type { Job, User as UserType } from '../lib/types';

interface HomePageProps {
  user: UserType;
}

export function HomePage({ user }: HomePageProps) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = jobs.filter(job =>
        job.title.toLowerCase().includes(lowerSearch) ||
        job.company.toLowerCase().includes(lowerSearch)
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  }, [searchTerm, jobs]);

  const loadJobs = async () => {
    setIsLoading(true);
    
    // Only load jobs for university/postgrad users
    if (user.user_type === 'uni_postgrad') {
      const fetchedJobs = await jobService.getJobs(user.user_type, user.discipline);
      setJobs(fetchedJobs);
      setFilteredJobs(fetchedJobs);
    } else {
      // High school students don't get jobs
      setJobs([]);
      setFilteredJobs([]);
    }
    
    setIsLoading(false);
  };

  const handleJobClick = (jobId: number) => {
    navigate(`/job/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/axiom-logo.png" 
                alt="AXIOM.AI Logo" 
                className="w-20 h-20"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AXIOM.AI</h1>
                <p className="text-xs text-gray-500">Build your career with confidence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/chatbot')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.user_type === 'high_school' ? (
          // High School Student Content - DSE Calculator Feature
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                DSE Calculator & University Planning
              </h2>
              <p className="text-gray-600">
                Calculate your DSE scores and discover which university programs you qualify for
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* DSE Calculator Card */}
              <div className="bg-white rounded-xl shadow-lg border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">DSE Score Calculator</h3>
                    <p className="text-sm text-gray-600">Find your matching university programs</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Enter your DSE subject scores to see which university programs you qualify for and 
                  get personalized recommendations for your academic future.
                </p>
                <button
                  onClick={() => navigate('/dse-calculator')}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Start DSE Calculator
                </button>
              </div>

              {/* Career Guidance Card */}
              <div className="bg-white rounded-xl shadow-lg border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Career Assistant</h3>
                    <p className="text-sm text-gray-600">Get personalized guidance</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Ask questions about university choices, career paths, study tips, and get 
                  personalized advice for your academic journey.
                </p>
                <button
                  onClick={() => navigate('/chatbot')}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                >
                  Chat with Assistant
                </button>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Academic Resources</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Study Tips</h4>
                  <p className="text-green-700 text-sm">
                    Effective study strategies for DSE preparation and academic success.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">University Guide</h4>
                  <p className="text-orange-700 text-sm">
                    Learn about different universities and their admission requirements.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
                  <h4 className="font-semibold text-indigo-900 mb-2">Career Exploration</h4>
                  <p className="text-indigo-700 text-sm">
                    Discover different career paths and industry insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // University Student Content - Job Opportunities
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Job Opportunities
              </h2>
              <p className="text-gray-600">
                Browse {user.discipline} roles curated for your field of study
                {user.university && ` at ${user.university}`}
                {user.current_year && ` (${user.current_year})`}
              </p>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  {searchTerm ? 'No jobs found matching your search.' : 'No jobs available at the moment.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.map(job => (
                  <JobCard key={job.id} job={job} onClick={handleJobClick} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
