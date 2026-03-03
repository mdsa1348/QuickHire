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
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jobs');
      const data = await res.json();
      setJobs(data);
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
    const matchesCategory = category === 'All' || job.category === category;
    
    return matchesSearch && matchesLocation && matchesCategory;
  });

  const categories = ['All', 'Design', 'Engineering', 'Product', 'Sales', 'Marketing'];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-light pt-16 pb-24 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 z-10">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Discover <br />
              more than <br />
              <span className="text-sky-400">5000+ Jobs</span>
            </h1>
            <div className="h-2 w-48 bg-sky-400 mt-2 mb-8 rounded-full opacity-50"></div>
            <p className="text-text-gray text-lg max-w-md leading-relaxed">
              Great platform for the job seeker that searching for new career heights and passionate about startups.
            </p>

            {/* Search Box */}
            <div className="mt-12 bg-white p-4 shadow-xl flex flex-col md:flex-row gap-4 border border-border">
              <div className="flex-1 flex items-center gap-3 px-2 border-b md:border-b-0 md:border-r border-border pb-2 md:pb-0">
                <svg className="w-6 h-6 text-text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input 
                  type="text" 
                  placeholder="Job title or keyword" 
                  className="w-full outline-none text-text-dark font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex-1 flex items-center gap-3 px-2 border-b md:border-b-0 md:border-r border-border pb-2 md:pb-0">
                <svg className="w-6 h-6 text-text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <input 
                  type="text" 
                  placeholder="Florence, Italy" 
                  className="w-full outline-none text-text-dark font-medium"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button className="bg-primary text-white font-bold px-10 py-4 transition-all hover:bg-opacity-90">
                Search my job
              </button>
            </div>
            
            <p className="mt-8 text-text-gray font-medium">
              Popular : <span className="text-text-dark">UI Designer, UX Researcher, Android, Admin</span>
            </p>
          </div>

          <div className="flex-1 hidden md:block">
             {/* Decorative image or illustration would go here */}
             <div className="relative w-full aspect-square bg-blue-100 rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                {/* Placeholder for the guy in the picture */}
                <div className="absolute inset-0 flex items-center justify-center text-primary/20 text-9xl font-black">
                  QH
                </div>
             </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2"></div>
      </section>

      {/* Categories / Filter Section */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-text-dark leading-tight">
              Explore by <span className="text-primary font-black">category</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-full font-bold transition-all border ${
                  category === cat 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white text-text-gray border-border hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 gap-6">
          <h3 className="text-2xl font-bold text-text-dark mb-4 border-b border-border pb-4">
            Latest <span className="text-primary">jobs open</span>
          </h3>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-text-gray font-bold">Finding the best roles for you...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))
          ) : (
            <div className="text-center py-20 border border-dashed border-border rounded-lg">
              <p className="text-text-gray text-lg font-bold">No jobs found matching your criteria.</p>
              <button 
                onClick={() => {setSearch(''); setLocation(''); setCategory('All');}}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="bg-gray-900 text-white py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">Q</div>
              <span className="text-2xl font-bold">QuickHire</span>
            </div>
            <p className="text-gray-400 max-w-sm mb-8">
              Great platform for the job seeker that searching for new career heights and passionate about startups.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-6">About</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Companies</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Advice</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-6">Resources</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Help Docs</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Guide</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Updates</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-gray-800 text-gray-500 text-sm flex flex-col md:flex-row justify-between gap-4">
          <p>2026 QuickHire. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
