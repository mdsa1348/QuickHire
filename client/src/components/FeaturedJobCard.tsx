import Link from 'next/link';

interface FeaturedJobCardProps {
  job: {
    title: string;
    company: string;
    location: string;
    description: string;
    categories: string[];
    logo: string;
  };
}

const FeaturedJobCard = ({ job }: FeaturedJobCardProps) => {
  // Helper to get brand color based on company name
  const getBrandStyles = (company: string) => {
    switch(company) {
      case 'Revolut': return 'bg-[#191C1F] text-white';
      case 'Dropbox': return 'bg-[#0061FF] text-white';
      case 'Pitch': return 'bg-[#FF4F00] text-white';
      case 'Blinklist': return 'bg-[#00D06D] text-white';
      case 'ClassPass': return 'bg-[#212121] text-white';
      case 'Canva': return 'bg-[#00C4CC] text-white';
      case 'GoDaddy': return 'bg-[#00A63F] text-white';
      case 'Twitter': return 'bg-[#1DA1F2] text-white';
      default: return 'bg-[#4640DE]/10 text-[#4640DE]';
    }
  };

  return (
    <div className="border border-[#D6DDEB] p-8 bg-white hover:border-[#4640DE] transition-all flex flex-col group h-full hover:shadow-2xl relative">
      <div className="flex justify-between items-start mb-10">
        <div className={`w-14 h-14 flex items-center justify-center font-black text-2xl shadow-lg transform group-hover:scale-110 transition-transform ${getBrandStyles(job.company)}`}>
          {job.logo}
        </div>
        <span className="bg-[#4640DE]/5 text-[#4640DE] px-4 py-1.5 text-sm font-black border border-[#4640DE]/20 tracking-wide">
          Full Time
        </span>
      </div>
      
      <h3 className="text-2xl font-black text-[#25324B] mb-2 group-hover:text-[#4640DE] transition-colors leading-tight">
        {job.title}
      </h3>
      
      <div className="flex items-center gap-3 text-[#515B6F] text-base mb-6 font-bold opacity-70">
        <span>{job.company}</span>
        <span className="w-1.5 h-1.5 bg-[#4640DE] rounded-full opacity-30"></span>
        <span>{job.location}</span>
      </div>
      
      <p className="text-[#515B6F] text-lg mb-8 line-clamp-2 leading-relaxed font-medium">
        {job.description}
      </p>
      
      <div className="flex flex-wrap gap-2.5 mt-auto">
        {job.categories.map((cat) => (
          <span 
            key={cat}
            className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase ${
              cat === 'Marketing' ? 'bg-[#FFB836]/10 text-[#FFB836]' : 
              cat === 'Design' ? 'bg-[#56CDAD]/10 text-[#56CDAD]' :
              cat === 'Business' ? 'bg-[#4640DE]/10 text-[#4640DE]' :
              'bg-[#FF6550]/10 text-[#FF6550]'
            }`}
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FeaturedJobCard;
