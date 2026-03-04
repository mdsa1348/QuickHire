'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import JobCard from '@/components/JobCard';
import FeaturedJobCard from '@/components/FeaturedJobCard';
import { Job } from '@/types';

interface FeaturedJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  categories: string[];
  logo: string;
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [featuredJobs, setFeaturedJobs] = useState<FeaturedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchFeaturedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jobs');
      const data = await res.json();
      const backendJobs = Array.isArray(data) ? data : [];
      if (backendJobs.length === 0) {
        setJobs(latestJobsData as unknown as Job[]);
      } else {
        setJobs(backendJobs);
      }
    } catch (err) {
      console.error('Failed to fetch jobs', err);
      setJobs(latestJobsData as unknown as Job[]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/featured-jobs');
      const data = await res.json();
      const backendFeatured = Array.isArray(data) ? data : [];
      if (backendFeatured.length > 0) {
        setFeaturedJobs(backendFeatured);
      } else {
        setFeaturedJobs(featuredJobsData);
      }
    } catch (err) {
      console.error('Failed to fetch featured jobs', err);
      setFeaturedJobs(featuredJobsData);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = (job.title?.toLowerCase() || '').includes(search.toLowerCase()) || 
                          (job.company?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesLocation = (job.location?.toLowerCase() || '').includes(location.toLowerCase());
    const matchesCategory = !activeCategory || (job.category?.toLowerCase() || '') === activeCategory.toLowerCase();
    return matchesSearch && matchesLocation && matchesCategory;
  });

  const categories = [
    { 
      title: 'Design', 
      icon: (
        <svg className="w-8 h-8 text-[#4640DE] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ) 
    },
    { 
      title: 'Sales', 
      icon: (
        <svg className="w-8 h-8 text-[#4640DE] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ) 
    },
    { 
      title: 'Marketing', 
      icon: (
        <svg className="w-8 h-8 text-[#4640DE] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ) 
    },
    { 
      title: 'Finance', 
      icon: (
        <svg className="w-8 h-8 text-[#4640DE] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) 
    },
    { 
      title: 'Technology', 
      icon: (
        <svg className="w-8 h-8 text-[#4640DE] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ) 
    },
    { 
      title: 'Engineering', 
      icon: (
        <svg className="w-8 h-8 text-[#4640DE] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ) 
    },
    { 
      title: 'Business', 
      icon: (
        <svg className="w-8 h-8 text-[#4640DE] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ) 
    },
    { 
      title: 'Human Resource', 
      icon: (
        <svg className="w-8 h-8 text-[#4640DE] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ) 
    },
  ];

  // Real per-category counts derived from fetched jobs
  const getCount = (title: string) =>
    jobs.filter(j => (j.category || '').toLowerCase() === title.toLowerCase()).length;




  // Fallback data (used if backend is unavailable)
  const featuredJobsData: FeaturedJob[] = [
    { _id: 'f1', title: 'Email Marketing', company: 'Revolut', location: 'Madrid, Spain', description: 'Revolut is looking for Email Marketing to help team ma ...', categories: ['Marketing', 'Design'], logo: 'R' },
    { _id: 'f2', title: 'Brand Designer', company: 'Dropbox', location: 'San Fransisco, US', description: 'Dropbox is looking for Brand Designer to help the team t ...', categories: ['Design', 'Business'], logo: 'D' },
    { _id: 'f3', title: 'Email Marketing', company: 'Pitch', location: 'Berlin, Germany', description: 'Pitch is looking for Customer Manager to join marketing t ...', categories: ['Marketing'], logo: 'P' },
    { _id: 'f4', title: 'Visual Designer', company: 'Blinklist', location: 'Granada, Spain', description: 'Blinklist is looking for Visual Designer to help team desi ...', categories: ['Design'], logo: 'B' },
    { _id: 'f5', title: 'Product Designer', company: 'ClassPass', location: 'Manchester, UK', description: 'ClassPass is looking for Product Designer to help us...', categories: ['Marketing', 'Design'], logo: 'C' },
    { _id: 'f6', title: 'Lead Designer', company: 'Canva', location: 'Ontario, Canada', description: 'Canva is looking for Lead Engineer to help develop n ...', categories: ['Design', 'Business'], logo: 'Ca' },
    { _id: 'f7', title: 'Brand Strategist', company: 'GoDaddy', location: 'Marseille, France', description: 'GoDaddy is looking for Brand Strategist to join the team...', categories: ['Marketing'], logo: 'G' },
    { _id: 'f8', title: 'Data Analyst', company: 'Twitter', location: 'San Diego, US', description: 'Twitter is looking for Data Analyst to help team desi ...', categories: ['Technology'], logo: 'T' },
  ];

  const latestJobsData = [
    { _id: '1', title: 'Social Media Assistant', company: 'Nomad', location: 'Paris, France', category: 'Marketing' },
    { _id: '2', title: 'Social Media Assistant', company: 'Netlify', location: 'Paris, France', category: 'Marketing' },
    { _id: '3', title: 'Brand Designer', company: 'Dropbox', location: 'San Fransisco, USA', category: 'Design' },
    { _id: '4', title: 'Brand Designer', company: 'Maze', location: 'San Fransisco, USA', category: 'Design' },
    { _id: '5', title: 'Interactive Developer', company: 'Terraform', location: 'Hamburg, Germany', category: 'Technology' },
    { _id: '6', title: 'Interactive Developer', company: 'Udacity', location: 'Hamburg, Germany', category: 'Technology' },
    { _id: '7', title: 'HR Manager', company: 'Packer', location: 'Lucern, Switzerland', category: 'Human Resource' },
    { _id: '8', title: 'HR Manager', company: 'Webflow', location: 'Lucern, Switzerland', category: 'Human Resource' },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#F8F8FD] min-h-screen relative flex flex-col justify-center px-6 md:px-32 pt-24 pb-16 overflow-hidden">
        {/* Full Height Background Design Layer */}
        <div className="absolute inset-0 z-0 text-white">
           <img 
            src="/images/background_design.png" 
            alt="" 
            className="absolute top-0 right-0 h-full w-auto lg:w-[65%] object-cover object-left opacity-100" 
          />
        </div>

        {/* Diagonal Cut (Bottom Right) */}
        <div className="absolute bottom-0 right-0 w-full lg:w-[45%] h-32 lg:h-[25%] bg-white z-20 hidden lg:block" 
             style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}>
        </div>

        <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row items-center relative z-10">
          <div className="flex-1 lg:max-w-[65%] pt-10 lg:pt-0">
            <h1 className="text-[2.6rem] md:text-[3.5rem] font-black leading-[1.05] text-[#25324B] tracking-tight mb-2">
              Discover <br />
              more than <br />
              <div className="relative inline-block mt-2 md:mt-0">
                <span className="text-[#26A4FF]">5000+ Jobs</span>
                <img src="/images/underline.png" className="absolute -bottom-8 md:-bottom-10 left-0 w-[110%] h-auto max-w-none" alt="" />
              </div>
            </h1>
            
            <p className="text-[#515B6F] text-base md:text-xl mt-12 md:mt-12 max-w-lg leading-relaxed font-medium opacity-60">
              Great platform for the job seeker that searching for new career heights and passionate about startups.
            </p>

            {/* High-fidelity Search Box */}
            <div className="mt-14 bg-white p-6 md:p-4 shadow-[0_40px_80px_-20px_rgba(11,21,41,0.15)] flex flex-col md:flex-row gap-0 w-full lg:w-[65vw] max-w-[1300px] border border-[#E9E9E9] relative z-50">
              <div className="flex-[1.5] flex items-center gap-4 py-4 md:px-6 md:py-6 relative">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-[#25324B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <div className="flex-1 border-b border-[#E9E9E9] md:border-b-0 pb-1 md:pb-0">
                  <input 
                    type="text" 
                    placeholder="Job title or keyword" 
                    className="w-full outline-none text-[#25324B] font-medium text-base md:text-lg placeholder:text-[#CED4DE] bg-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-[60%] w-[1px] bg-[#E9E9E9]"></div>
              </div>
              
              <div className="flex-1 flex items-center gap-4 py-4 md:px-6 md:py-6">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-[#25324B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <div className="flex-1 flex items-center justify-between border-b border-[#E9E9E9] md:border-b-0 pb-1 md:pb-0">
                  <input 
                    type="text" 
                    placeholder="Florence, Italy" 
                    className="w-full outline-none text-[#25324B] font-medium text-base md:text-lg placeholder:text-[#CED4DE] bg-transparent"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <svg className="w-4 h-4 text-[#25324B] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              
              <button className="bg-[#4640DE] text-white font-bold px-8 md:px-14 py-4 md:py-6 mt-4 md:mt-0 transition-all hover:bg-[#342FBF] whitespace-nowrap text-lg">
                Search my job
              </button>
            </div>
            
            <div className="mt-10 md:flex items-center gap-2">
              <span className="text-[#515B6F] font-bold text-xs md:text-lg opacity-60">Popular : </span>
              <p className="text-[#25324B] font-bold text-xs md:text-lg">
                UI Designer, UX Researcher, Android, Admin
              </p>
            </div>
          </div>

          <div className="flex-1 hidden lg:flex h-full relative items-end justify-end">
             <img 
               src="/images/person_pointing.png" 
               alt="" 
               className="h-[85vh] w-auto max-w-none object-contain z-10 translate-y-[5%] translate-x-[5%]" 
             />
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-16 md:py-10 px-8 md:px-12 bg-white relative z-30">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-[#515B6F] mb-14 md:mb-10 md:pl-20 text-lg md:text-xl opacity-50 text-left">Companies we helped grow</p>
          <div className="md:px-16 grid grid-cols-2 lg:flex items-center justify-between gap-y-4 gap-x-4 lg:gap-4">
            <div className="flex justify-start md:justify-center"><img src="/images/Screenshot 2026-03-04 172528.png" alt="Company 1" className="h-22 md:h-20 w-auto object-contain" /></div>
            <div className="flex justify-start md:justify-center"><img src="/images/Screenshot 2026-03-04 172534.png" alt="Company 2" className="h-22 md:h-20 w-auto object-contain" /></div>
            <div className="flex justify-start md:justify-center"><img src="/images/Screenshot 2026-03-04 172540.png" alt="Company 3" className="h-22 md:h-20 w-auto object-contain" /></div>
            <div className="flex justify-start md:justify-center"><img src="/images/Screenshot 2026-03-04 172547.png" alt="Company 4" className="h-22 md:h-20 w-auto object-contain" /></div>
            <div className="flex justify-start md:justify-center md:col-span-1"><img src="/images/Screenshot 2026-03-04 172556.png" alt="Company 5" className="h-22 md:h-20 w-auto object-contain" /></div>
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="py-24 px-6 md:px-32 bg-white relative z-30 border-t border-[#F1F1F1]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex md:flex-row flex-col justify-between items-start md:items-end mb-12 md:mb-20 gap-6">
            <h2 className="text-2xl md:text-6xl font-black text-[#25324B] leading-tight text-left">
              Explore by <span className="text-[#26A4FF]">category</span>
            </h2>
            <Link href="/jobs" className="hidden md:flex text-primary font-black items-center gap-2 group text-base md:text-xl border-b-2 border-transparent hover:border-primary pb-1 transition-all">
              Show all jobs
              <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {categories.map(cat => (
              <div 
                key={cat.title} 
                onClick={() => { setActiveCategory(activeCategory === cat.title ? '' : cat.title); document.getElementById('latest-jobs')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`p-6 md:p-10 border rounded-none transition-all cursor-pointer group shadow-sm hover:shadow-2xl flex md:flex-col items-center md:items-start gap-4 md:gap-0 ${activeCategory === cat.title ? 'bg-[#4640DE] border-[#4640DE]' : 'bg-white border-[#D6DDEB] hover:bg-[#4640DE] hover:border-[#4640DE]'}`}
              >
                <div className="text-2xl md:text-4xl md:mb-8 group-hover:bg-white/20 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-none transition-all bg-[#F8F8FD] flex-shrink-0">
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-black mb-1 md:mb-3 text-[#25324B] !group-hover:text-white transition-colors">{cat.title}</h3>
                  <p className="font-bold text-sm md:text-lg text-[#515B6F] group-hover:text-white opacity-70 group-hover:opacity-100 transition-all">
                    {loading ? '…' : getCount(cat.title)} jobs available
                  </p>
                </div>
                <svg className="w-5 h-5 text-[#25324B] group-hover:text-white transition-colors block md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                <div className="hidden md:flex items-center justify-between w-full mt-4">
                   <div className="flex-1"></div>
                   <svg className="w-5 h-5 text-[#25324B] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex md:hidden justify-start">
            <Link href="/jobs" className="text-primary font-black flex items-center gap-3 group text-lg transition-all">
              Show all jobs
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Start Posting Jobs Section */}
      <section className="px-4 md:px-32 bg-white relative z-30 py-4 md:py-8">
        <div className="max-w-[1440px] mx-auto relative">
          <div 
            className="bg-[#4640DE] relative flex flex-col md:flex-row items-center overflow-hidden pr-0 md:pr-24 min-h-[320px] md:min-h-[440px]"
            style={{ 
              clipPath: 'polygon(0 80px, 140px 0, 100% 0, 100% calc(100% - 100px), calc(100% - 140px) 100%, 0 100%)' 
            }}
          >
            <div className="relative z-30 flex-1 pt-16 md:pt-16 pb-4 md:pb-16 text-white text-center md:text-left px-6 md:px-20">
              <h2 className="text-[2.2rem] md:text-5xl font-bold mb-4 md:mb-6 leading-[1.05] tracking-tight">
                Start posting <br className="hidden md:block"/> jobs today
              </h2>
              <p className="text-base md:text-xl font-medium mb-10 md:mb-10 opacity-90">
                Start posting jobs for only $10.
              </p>
              <div className="flex justify-center md:justify-start">
                <button className="bg-white text-[#4640DE] font-bold px-10 py-5 md:px-12 md:py-5 text-sm md:text-lg hover:bg-gray-100 transition-all shadow-2xl active:scale-95 w-full md:w-auto uppercase tracking-widest rounded-none">
                  Sign Up For Free
                </button>
              </div>
            </div>

            {/* Mobile-only image stacked below text, inside blue card */}
            <div className="block md:hidden w-full px-4 pb-8 mt-4 relative z-50">
              <img
                src="/images/dashboard.png"
                alt="QuickHire Dashboard"
                className="w-full h-auto object-contain shadow-xl rounded-sm"
              />
            </div>

            {/* Spacer for the image on desktop */}
            <div className="hidden md:block flex-[1.2]"></div>
          </div>

          {/* Image positioned outside the clipped container to overlap the bottom cut */}
          <div className="hidden md:flex absolute top-0 right-0 h-full w-full md:w-1/2 items-center justify-center md:justify-start pointer-events-none z-40">
            <div className="w-[90%] md:w-[100%] transform translate-y-6 md:translate-y-6 md:-translate-x-12">
              <img 
                src="/images/dashboard.png" 
                alt="QuickHire Dashboard" 
                className="w-full h-auto object-contain pointer-events-auto "
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-24 px-6 md:px-32 bg-white relative z-30">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-3xl md:text-6xl font-black text-[#25324B]">
              Featured <span className="text-[#26A4FF]">jobs</span>
            </h2>
            <Link href="/jobs" className="hidden md:flex text-primary font-black items-center gap-2 group text-base md:text-xl hover:opacity-80 transition-all">
              Show all jobs
              <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>

          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 overflow-x-auto md:overflow-hidden pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar">
            {featuredJobs.map((job, idx) => (
              <div key={job._id || idx} className="min-w-[85vw] md:min-w-0 snap-center">
                <FeaturedJobCard job={job} />
              </div>
            ))}
          </div>

          <div className="mt-12 flex md:hidden justify-start">
            <Link href="/jobs" className="text-primary font-black flex items-center gap-3 group text-lg transition-all">
              Show all jobs
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section with Dynamic Background */}
      <section id="latest-jobs" className="py-32 px-6 md:px-32 bg-[#F8F8FD] relative z-30 overflow-hidden">
        {/* Decorative Background Image - Zoomed and Rotated */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] rotate-45  pointer-events-none z-0">
          <img 
            src="/images/background_design.png" 
            alt="" 
            className="w-full h-auto object-contain" 
          />
        </div>

        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="flex flex-wrap justify-between items-end mb-20 gap-4">
            <div>
              <h2 className="text-3xl md:text-6xl font-black text-[#25324B]">
                Latest <span className="text-[#26A4FF]">jobs open</span>
              </h2>
              {activeCategory && (
                <div className="flex items-center gap-2 mt-4">
                  <span className="bg-[#4640DE]/10 text-[#4640DE] px-4 py-1.5 rounded-full text-sm font-black border border-[#4640DE]/20 tracking-wide">
                    {activeCategory}
                  </span>
                  <button onClick={() => setActiveCategory('')} className="text-[#515B6F] hover:text-[#25324B] font-bold text-sm flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                    Clear
                  </button>
                </div>
              )}
            </div>
            <Link href="/jobs" className="hidden md:flex text-[#4640DE] font-black items-center gap-2 group text-base md:text-xl transition-all">
              Show all jobs
              <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {loading && jobs.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white border border-border">
                <div className="animate-spin rounded-full h-16 w-16 border-b-[4px] border-primary mx-auto"></div>
                <p className="mt-6 text-[#515B6F] font-black text-2xl">Finding the best roles for you...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-white border border-dashed border-[#D6DDEB] rounded-none">
                <p className="text-[#515B6F] text-2xl font-black">No jobs found matching your criteria.</p>
                <button 
                   onClick={() => {setSearch(''); setLocation(''); setActiveCategory('');}}
                  className="mt-6 text-primary font-black text-xl hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          <div className="mt-12 flex md:hidden justify-start">
            <Link href="/jobs" className="text-[#4640DE] font-black flex items-center gap-3 group text-lg transition-all">
              Show all jobs
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#202430] text-white pt-24 pb-12 px-6 py-6 md:px-32 relative z-30">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row flex-wrap justify-between mb-20 border-b border-white/10 pb-20 gap-y-12">
            <div className="w-full md:w-[32%]">
              <div className="flex items-center gap-3 mb-10">
                <img src="/images/logo.png" alt="QuickHire" className="h-8 w-auto invert" />
                <span className="text-2xl font-black tracking-tight">QuickHire</span>
              </div>
              <p className="text-[#D6DDEB] text-base md:text-lg leading-relaxed mb-10 max-w-xs font-medium">
                Great platform for the job seeker that passionate about startups. Find your dream job easier.
              </p>
            </div>
            
            <div className="w-full md:w-[12%]">
              <h4 className="text-xl font-bold !text-white mb-8">About</h4>
              <ul className="space-y-4 text-[#D6DDEB] text-lg font-medium ">
                <li><Link href="#" className="hover:text-white transition-colors">Companies</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Advice</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div className="w-full md:w-[11%]">
              <h4 className="text-xl font-bold !text-white mb-8">Resources</h4>
              <ul className="space-y-4 text-[#D6DDEB] text-lg font-medium ">
                <li><Link href="#" className="hover:text-white transition-colors">Help Docs</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Guide</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Updates</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div className="w-full md:w-[40%]">
              <h4 className="text-xl font-bold !text-white mb-8">Get job notifications</h4>
              <p className="text-[#D6DDEB] text-base md:text-lg mb-8 leading-relaxed font-medium">The latest job news, articles, sent to your inbox weekly.</p>
              <div className="flex flex-col md:flex-row gap-4 md:gap-0">
                <input 
                  type="text" 
                  placeholder="Email Address" 
                  className="bg-white p-4 flex-1 outline-none text-[#25324B] placeholder:text-[#CED4DE] text-base md:text-lg font-medium" 
                />
                <button className="bg-[#4640DE] px-10 py-4 font-bold text-base md:text-lg hover:bg-[#342FBF] transition-all whitespace-nowrap w-fit md:w-auto">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-10 items-center text-[#D6DDEB] font-medium text-lg">
            <p className="opacity-50">2021 @ QuickHire. All rights reserved.</p>
            <div className="flex gap-6">
              {[
                { name: 'facebook', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { name: 'instagram', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M17.5 6.5h.01' },
                { name: 'web', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
                { name: 'linkedin', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z' },
                { name: 'twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' }
              ].map((social) => (
                <div key={social.name} className="w-10 h-10 bg-white/5 rounded-full hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center opacity-80">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    <path d={social.icon}></path>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
