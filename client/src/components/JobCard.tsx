import Link from 'next/link';
import { Job } from '@/types';

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <div className="border border-border p-6 rounded-sm bg-white hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start md:items-center">
      <div className="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center font-bold text-xl text-primary">
        {job.company?.[0] || 'Q'}
      </div>
      
      <div className="flex-1">
        <h3 className="text-xl font-bold text-text-dark">{job.title}</h3>
        <div className="flex flex-wrap gap-4 mt-1 text-text-gray text-sm font-medium">
          <span>{job.company}</span>
          <span className="flex items-center gap-1">• {job.location}</span>
          <span className="bg-primary-light text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/10">Full-time</span>
        </div>
        <p className="mt-4 text-text-gray line-clamp-2 text-sm leading-relaxed">
          {job.description}
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full md:w-auto">
        <Link 
          href={`/jobs/${job._id}`}
          className="bg-primary text-white text-center font-bold px-8 py-3 rounded-sm transition-colors hover:bg-opacity-90"
        >
          Apply
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
