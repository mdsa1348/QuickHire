'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import JobCard from '@/components/JobCard';
import { Job } from '@/types';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jobs');
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                          job.company.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = job.location.toLowerCase().includes(location.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  const categories = [
    { title: 'Design', count: 235, icon: '🎨' },
    { title: 'Sales', count: 756, icon: '📈' },
    { title: 'Marketing', count: 140, icon: '📢', active: true },
    { title: 'Finance', count: 325, icon: '💰' },
    { title: 'Technology', count: 436, icon: '💻' },
    { title: 'Engineering', count: 542, icon: '🛠️' },
    { title: 'Business', count: 211, icon: '💼' },
    { title: 'Human Resource', count: 346, icon: '👥' },
  ];

  const companies = ['Vodafone', 'Intel', 'Tesla', 'AMD', 'Talkit'];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#F8F8FD] py-16 md:py-24 px-6 md:px-32 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 z-10">
            <h1 className="text-6xl md:text-[5.5rem] font-bold leading-[1.1] text-[#25324B] tracking-tight mb-4">
              Discover <br />
              more than <br />
              <div className="relative inline-block mt-4">
                <span className="text-[#4640DE]">5000+ Jobs</span>
                <img src="/images/underline.png" className="absolute -bottom-6 left-0 w-full" alt="" />
              </div>
            </h1>
            
            <p className="text-[#515B6F] text-xl mt-16 max-w-lg leading-relaxed">
              Great platform for the job seeker that searching for new career heights and passionate about startups.
            </p>

            {/* Search Box */}
            <div className="mt-12 bg-white p-3 shadow-2xl flex flex-col md:flex-row gap-0 max-w-4xl">
              <div className="flex-[1.2] flex items-center gap-4 px-4 py-4 md:border-r border-border">
                <svg className="w-7 h-7 text-[#25324B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input 
                  type="text" 
                  placeholder="Job title or keyword" 
                  className="w-full h-full outline-none text-[#25324B] font-medium placeholder:text-gray-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex-1 flex items-center gap-4 px-4 py-4">
                <svg className="w-7 h-7 text-[#25324B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <div className="flex-1 flex items-center justify-between">
                  <input 
                    type="text" 
                    placeholder="Florence, Italy" 
                    className="w-full h-full outline-none text-[#25324B] font-medium placeholder:text-gray-300"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <svg className="w-5 h-5 text-[#25324B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              <button className="bg-[#4640DE] text-white font-bold px-12 py-5 transition-all hover:opacity-95 whitespace-nowrap">
                Search my job
              </button>
            </div>
            
            <p className="mt-8 text-[#515B6F] font-medium text-lg">
              Popular : <span className="text-[#25324B] font-bold">UI Designer, UX Researcher, Android, Admin</span>
            </p>
          </div>

          <div className="flex-1 hidden lg:block relative">
             <img src="/images/hero-guy.png" alt="" className="w-full h-auto relative z-10" />
             <img src="/images/hero-bg.png" alt="" className="absolute -top-10 -right-20 w-full opacity-30 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-12 px-6 md:px-32">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-[#515B6F] font-medium mb-10">Companies we helped grow</p>
          <div className="flex flex-wrap items-center justify-between gap-12 opacity-40 grayscale">
            {companies.map(c => (
              <span key={c} className="text-4xl font-black text-gray-500 tracking-tighter">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="py-24 px-6 md:px-32 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-5xl font-bold text-[#25324B]">
              Explore by <span className="text-[#4640DE]">category</span>
            </h2>
            <Link href="#" className="text-[#4640DE] font-bold flex items-center gap-2 group">
              Show all jobs
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map(cat => (
              <div 
                key={cat.title} 
                className={`p-10 border border-[#D6DDEB] rounded-sm transition-all cursor-pointer group hover:bg-[#4640DE] hover:border-[#4640DE] ${cat.active ? 'bg-[#4640DE] border-[#4640DE]' : 'bg-white'}`}
              >
                <div className={`text-4xl mb-8 group-hover:bg-white/20 w-16 h-16 flex items-center justify-center rounded-sm ${cat.active ? 'bg-white/20' : 'bg-[#F8F8FD]'}`}>
                  {cat.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${cat.active ? 'text-white' : 'text-[#25324B] group-hover:text-white'}`}>{cat.title}</h3>
                <div className="flex items-center justify-between">
                  <p className={`font-medium ${cat.active ? 'text-white/80' : 'text-[#515B6F] group-hover:text-white/80'}`}>
                    {cat.count} jobs available
                  </p>
                  <svg className={`w-5 h-5 ${cat.active ? 'text-white' : 'text-[#25324B] group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="py-24 px-6 md:px-32 bg-[#F8F8FD]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-5xl font-bold text-[#25324B]">
              Latest <span className="text-[#4640DE]">jobs open</span>
            </h2>
            <Link href="#" className="text-[#4640DE] font-bold flex items-center gap-2 group">
              Show all jobs
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {loading ? (
              <div className="text-center py-20 bg-white border border-border">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4640DE] mx-auto"></div>
                <p className="mt-4 text-[#515B6F] font-bold">Finding the best roles for you...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))
            ) : (
              <div className="text-center py-20 bg-white border border-dashed border-border rounded-lg">
                <p className="text-[#515B6F] text-lg font-bold">No jobs found matching your criteria.</p>
                <button 
                  onClick={() => {setSearch(''); setLocation('');}}
                  className="mt-4 text-[#4640DE] font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#202430] text-white pt-24 pb-12 px-6 md:px-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20 border-b border-gray-700 pb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-8">
                <img src="/images/logo.png" alt="QuickHire" className="h-8 w-auto invert" />
                <span className="text-3xl font-black">QuickHire</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Great platform for the job seeker that searching for new career heights and passionate about startups.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-xl mb-8">About</h4>
              <ul className="space-y-4 text-gray-400 text-lg">
                <li><Link href="#" className="hover:text-white transition-colors">Companies</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Advice</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-xl mb-8">Resources</h4>
              <ul className="space-y-4 text-gray-400 text-lg">
                <li><Link href="#" className="hover:text-white transition-colors">Help Docs</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Guide</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Updates</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xl mb-8">Get job notifications</h4>
              <p className="text-gray-400 text-lg mb-8">The latest job news, articles, sent to your inbox weekly.</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Email Address" className="bg-white/5 border border-gray-700 p-4 flex-1 outline-none focus:border-[#4640DE]" />
                <button className="bg-[#4640DE] px-6 py-4 font-bold">Subscribe</button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-8 items-center text-gray-500 font-medium">
            <p>2026 @ QuickHire. All rights reserved.</p>
            <div className="flex gap-8">
              {/* Icons would go here */}
              <div className="w-10 h-10 bg-white/10 rounded-full"></div>
              <div className="w-10 h-10 bg-white/10 rounded-full"></div>
              <div className="w-10 h-10 bg-white/10 rounded-full"></div>
              <div className="w-10 h-10 bg-white/10 rounded-full"></div>
              <div className="w-10 h-10 bg-white/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
