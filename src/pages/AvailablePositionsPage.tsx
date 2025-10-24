import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Briefcase, Users, MapPin, Filter } from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { jobService } from '../services/jobService';
import type { Job, User as UserType } from '../lib/types';

interface AvailablePositionsPageProps {
  user: UserType;
}

export function AvailablePositionsPage({ user }: AvailablePositionsPageProps) {
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
        job.company.toLowerCase().includes(lowerSearch) ||
        job.location?.toLowerCase().includes(lowerSearch)
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div 
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/')}
              >
                <img 
                  src="/axiom-logo.png" 
                  alt="AXIOM.AI Logo" 
                  className="w-16 h-16"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AXIOM.AI</h1>
                  <p className="text-xs text-gray-500">Career Opportunities</p>
                </div>
              </div>
            </div>
            {user.university && (
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-medium">{user.university}</span>
                {user.current_year && (
                  <span className="text-blue-600">• {user.current_year}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Available Career Opportunities
          </h2>
          <p className="text-xl text-gray-600">
            Explore {user.discipline || 'various'} positions curated for your career development
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by job title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-lg"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Filters</span>
            </button>
          </div>
        </div>

        {/* Job Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span className="text-lg font-medium">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'} found
            </span>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Job Listings */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading career opportunities...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No jobs found matching your search' : 'No opportunities available'}
            </h4>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or explore different keywords.' 
                : 'New opportunities are added regularly. Check back soon or set up job alerts.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View All Opportunities
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} onClick={handleJobClick} />
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredJobs.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Showing {filteredJobs.length} of {jobs.length} opportunities
            </p>
            <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Load More Opportunities
            </button>
          </div>
        )}
      </main>
    </div>
  );
}