import Link from 'next/link';
import { Job } from '@/types';

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <div className="border border-[#D6DDEB] p-8 bg-white hover:border-[#4640DE] transition-all flex flex-col md:flex-row gap-8 items-start md:items-center">
      <div className="w-[4.5rem] h-[4.5rem] bg-white border border-[#D6DDEB] rounded-none flex items-center justify-center font-bold text-2xl text-[#25324B]">
        {job.company?.[0] || 'Q'}
      </div>
      
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-[#25324B] mb-2">{job.title}</h3>
        <div className="flex flex-wrap gap-3 items-center text-[#515B6F] font-medium">
          <span>{job.company}</span>
          <span className="w-1.5 h-1.5 bg-[#515B6F] rounded-full opacity-30"></span>
          <span>{job.location}</span>
        </div>
        <div className="flex gap-2 mt-4">
          <span className="bg-[#4640DE]/10 text-[#4640DE] px-4 py-1.5 rounded-full text-sm font-bold border border-[#4640DE]/10">
            Full-time
          </span>
          <span className="bg-[#FFB836]/10 text-[#FFB836] px-4 py-1.5 rounded-full text-sm font-bold border border-[#FFB836]/10 uppercase tracking-wider">
            {job.category}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full md:w-auto items-end">
        <Link 
          href={`/jobs/${job._id}`}
          className="bg-[#4640DE] text-white text-center font-bold px-10 py-4 rounded-none transition-all hover:bg-opacity-95 w-full md:w-auto"
        >
          Apply
        </Link>
        <p className="text-[#515B6F] text-sm font-medium">5 days ago</p>
      </div>
    </div>
  );
};

export default JobCard;
