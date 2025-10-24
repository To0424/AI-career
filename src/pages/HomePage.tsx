import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { ChatbotWidget } from '../components/ChatbotWidget';
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
    const fetchedJobs = await jobService.getJobs(user.user_type, user.discipline);
    setJobs(fetchedJobs);
    setFilteredJobs(fetchedJobs);
    setIsLoading(false);
  };

  const handleJobClick = (jobId: number) => {
    navigate(`/job/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-50 border-b border-gray-300 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/axiom-logo.png" 
                alt="AXIOM.AI Logo" 
                className="w-20 h-20"
              />
              <h1 className="text-2xl font-bold text-gray-900">AI Career Planner</h1>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {user.user_type === 'high_school' ? 'Internship Opportunities' : 'Job Opportunities'}
          </h2>
          <p className="text-gray-600">
            {user.user_type === 'high_school'
              ? 'Explore part-time and internship positions suitable for students'
              : `Browse ${user.discipline} roles curated for your field`}
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      </main>

      <ChatbotWidget userId={user.id} userType={user.user_type} />
    </div>
  );
}
