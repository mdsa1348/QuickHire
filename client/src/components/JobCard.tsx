import Link from 'next/link';
import { Job } from '@/types';

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  // Helper to get brand color based on company name
  const getBrandStyles = (company: string) => {
    switch(company) {
      case 'Nomad': return 'bg-[#FF4F00] text-white';
      case 'Netlify': return 'bg-[#00AD9F] text-white';
      case 'Dropbox': return 'bg-[#0061FF] text-white';
      case 'Maze': return 'bg-[#191C1F] text-white';
      case 'Terraform': return 'bg-[#5C4EE5] text-white';
      case 'Udacity': return 'bg-[#01B3E3] text-white';
      case 'Packer': return 'bg-[#191C1F] text-white';
      case 'Webflow': return 'bg-[#4353FF] text-white';
      default: return 'bg-[#4640DE] text-white';
    }
  };

  return (
    <Link 
      href={`/jobs/${job._id}`}
      className="group border border-[#D6DDEB] bg-white p-8 flex items-center gap-8 hover:border-[#4640DE] hover:shadow-2xl transition-all relative overflow-hidden"
    >
      <div className={`w-20 h-20 flex-shrink-0 flex items-center justify-center text-3xl font-black shadow-lg transform group-hover:scale-105 transition-transform ${getBrandStyles(job.company)}`}>
        {job.company?.[0]}
      </div>
      
      <div className="flex-1">
        <h3 className="text-2xl font-black text-[#25324B] mb-2 leading-tight group-hover:text-[#4640DE] transition-colors">{job.title}</h3>
        <div className="flex items-center gap-3 text-[#515B6F] text-lg font-bold opacity-70 mb-5">
           <span>{job.company}</span>
           <span className="w-1.5 h-1.5 bg-[#4640DE] rounded-full opacity-30"></span>
           <span>{job.location}</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <span className="bg-[#56CDAD]/10 text-[#56CDAD] px-5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase">
            Full-Time
          </span>
          <span className="border-2 border-[#FFB836]/30 text-[#FFB836] px-5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase">
            Marketing
          </span>
          <span className="border-2 border-[#4640DE]/30 text-[#4640DE] px-5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase">
            Design
          </span>
        </div>
      </div>

      <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-2">
        <svg className="w-10 h-10 text-[#4640DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      </div>
    </Link>
  );
};

export default JobCard;
