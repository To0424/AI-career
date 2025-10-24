import { Briefcase, AlertTriangle } from 'lucide-react';
import type { Job } from '../lib/types';

interface JobCardProps {
  job: Job;
  onClick: (jobId: number) => void;
}

const SOURCE_COLORS = {
  JobsDB: 'bg-blue-100 text-blue-700',
  LinkedIn: 'bg-sky-100 text-sky-700',
  CTgoodjobs: 'bg-green-100 text-green-700',
  Openjobs: 'bg-orange-100 text-orange-700',
};

export function JobCard({ job, onClick }: JobCardProps) {
  const isScam = (job.scam_score || 0) > 0.5;

  return (
    <div
      onClick={() => onClick(job.id)}
      className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
        </div>
        {isScam && (
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
        )}
      </div>

      <p className="text-gray-700 font-medium mb-2">{job.company}</p>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {job.description}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`px-2 py-1 rounded text-xs font-medium ${SOURCE_COLORS[(job.source as keyof typeof SOURCE_COLORS) || 'JobsDB']}`}>
          {job.source}
        </span>
        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
          {job.discipline}
        </span>
        {isScam && (
          <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
            Potential Scam
          </span>
        )}
      </div>
    </div>
  );
}
