import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { crowdsourcedStatsService } from '../services/crowdsourcedStatsService';
import type { Job, CompanyStats, User } from '../lib/types';

interface JobDetailsPageProps {
  user: User;
}

const SOURCE_COLORS = {
  JobsDB: 'bg-blue-100 text-blue-700',
  LinkedIn: 'bg-sky-100 text-sky-700',
  CTgoodjobs: 'bg-green-100 text-green-700',
  Openjobs: 'bg-orange-100 text-orange-700',
};

export function JobDetailsPage({ user }: JobDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  const loadJobDetails = async () => {
    if (!id) return;

    setIsLoading(true);

    const jobData = await jobService.getJobById(parseInt(id));
    if (jobData) {
      setJob(jobData);

      const statsData = await crowdsourcedStatsService.getStatsByCompany(jobData.company);
      setStats(statsData);

      if (user.user_type === 'uni_postgrad') {
        const applied = await applicationService.hasApplied(user.id, jobData.id);
        setHasApplied(applied);
      }
    }

    setIsLoading(false);
  };

  const handleApply = async () => {
    if (!job || !job.url) return;

    window.open(job.url, '_blank');

    if (user.user_type === 'uni_postgrad' && !hasApplied) {
      setIsApplying(true);
      const application = await applicationService.createApplication(user.id, job.id);
      if (application) {
        setHasApplied(true);
      }
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Job not found</p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Return to previous page
          </button>
        </div>
      </div>
    );
  }

  const isScam = (job.scam_score || 0) > 0.5;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isScam && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Potential Scam Warning</h3>
                <p className="text-red-700 text-sm">
                  This job posting has been flagged as potentially fraudulent. Be cautious of jobs requiring upfront payments,
                  promising unrealistic earnings, or lacking clear company information. Always verify the employer independently.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{job.title}</h1>
            <h2 className="text-xl text-gray-700 font-medium mb-4">{job.company}</h2>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded text-sm font-medium ${SOURCE_COLORS[(job.source as keyof typeof SOURCE_COLORS) || 'JobsDB']}`}>
                {job.source}
              </span>
              <span className="px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-700">
                {job.discipline}
              </span>
              {hasApplied && (
                <span className="px-3 py-1 rounded text-sm font-medium bg-green-100 text-green-700">
                  Applied
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>
        </div>

        {stats && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Response Rate</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.response_rate}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.avg_response_time}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            {isApplying ? 'Processing...' : hasApplied ? 'View Application' : 'Apply Now'}
          </button>
        </div>
      </main>
    </div>
  );
}
