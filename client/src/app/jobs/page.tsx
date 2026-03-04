'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import JobCard from '@/components/JobCard';
import { Job } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  'Design',
  'Sales',
  'Marketing',
  'Finance',
  'Technology',
  'Engineering',
  'Business',
  'Human Resource',
];

const JOB_TYPES = [
  { label: 'Full-Time', color: 'text-[#56CDAD]', border: 'border-[#56CDAD]' },
  { label: 'Part-Time', color: 'text-[#FFB836]', border: 'border-[#FFB836]' },
  { label: 'Remote', color: 'text-[#4640DE]', border: 'border-[#4640DE]' },
  { label: 'Internship', color: 'text-[#FF6550]', border: 'border-[#FF6550]' },
  { label: 'Contract', color: 'text-[#56CDAD]', border: 'border-[#56CDAD]' },
];

const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Director', 'VP or Above'];

function JobsPageInner() {
  const searchParams = useSearchParams();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState(searchParams.get('search') || '');
  const [searchLocation, setSearchLocation] = useState(searchParams.get('location') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs`);
        const data = await res.json();
        setAllJobs(Array.isArray(data) ? data : []);
      } catch {
        setAllJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }, []);

  const toggleJobType = useCallback((type: string) => {
    setSelectedJobTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }, []);

  const toggleExperience = useCallback((exp: string) => {
    setSelectedExperience(prev =>
      prev.includes(exp) ? prev.filter(e => e !== exp) : [...prev, exp]
    );
  }, []);

  const clearAll = () => {
    setSearchTitle('');
    setSearchLocation('');
    setSelectedCategories([]);
    setSelectedJobTypes([]);
    setSelectedExperience([]);
  };

  const filtered = allJobs.filter(job => {
    const titleMatch =
      !searchTitle ||
      job.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTitle.toLowerCase());
    const locationMatch =
      !searchLocation ||
      job.location.toLowerCase().includes(searchLocation.toLowerCase());
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.some(c => c.toLowerCase() === job.category?.toLowerCase());
    return titleMatch && locationMatch && categoryMatch;
  });

  const activeFilterCount =
    selectedCategories.length + selectedJobTypes.length + selectedExperience.length;

  return (
    <div className="bg-white min-h-screen">
      {/* ── Page Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-[#F8F8FD] pt-28 pb-10 px-6 md:px-32 border-b border-[#D6DDEB]">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-[#515B6F] text-base md:text-lg font-medium mb-2">
            Showing{' '}
            <span className="font-black text-[#25324B]">
              {loading ? '...' : filtered.length}
            </span>{' '}
            results
            {searchTitle && (
              <>
                {' '}for{' '}
                <span className="font-black text-[#4640DE]">"{searchTitle}"</span>
              </>
            )}
            {searchLocation && (
              <>
                {' '}in{' '}
                <span className="font-black text-[#4640DE]">"{searchLocation}"</span>
              </>
            )}
          </p>

          {/* Search Bar */}
          <div className="bg-white border border-[#D6DDEB] flex flex-col md:flex-row shadow-sm mt-4">
            <div className="flex-[1.5] flex items-center gap-4 px-6 py-4 md:py-5 relative">
              <svg className="w-6 h-6 text-[#25324B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Job title or keyword"
                className="w-full outline-none text-[#25324B] font-medium text-base placeholder:text-[#CED4DE] bg-transparent"
                value={searchTitle}
                onChange={e => setSearchTitle(e.target.value)}
                id="jobs-search-title"
              />
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-[60%] w-[1px] bg-[#D6DDEB]" />
            </div>

            <div className="flex-1 flex items-center gap-4 px-6 py-4 md:py-5 border-t border-[#D6DDEB] md:border-t-0">
              <svg className="w-6 h-6 text-[#25324B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                placeholder="City, country or remote"
                className="w-full outline-none text-[#25324B] font-medium text-base placeholder:text-[#CED4DE] bg-transparent"
                value={searchLocation}
                onChange={e => setSearchLocation(e.target.value)}
                id="jobs-search-location"
              />
            </div>

            <button
              id="jobs-search-btn"
              className="bg-[#4640DE] text-white font-bold px-12 py-4 md:py-5 transition-all hover:bg-[#342FBF] whitespace-nowrap text-base border-t border-[#D6DDEB] md:border-t-0"
            >
              Search
            </button>
          </div>

          {/* Active filters chips */}
          {(selectedCategories.length > 0 || selectedJobTypes.length > 0 || selectedExperience.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-[#515B6F] text-sm font-bold">Active filters:</span>
              {selectedCategories.map(c => (
                <button
                  key={c}
                  onClick={() => toggleCategory(c)}
                  className="flex items-center gap-1.5 bg-[#4640DE]/10 text-[#4640DE] px-3 py-1 text-xs font-black border border-[#4640DE]/20 hover:bg-[#4640DE]/20 transition-all"
                >
                  {c}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
              {selectedJobTypes.map(t => (
                <button
                  key={t}
                  onClick={() => toggleJobType(t)}
                  className="flex items-center gap-1.5 bg-[#56CDAD]/10 text-[#56CDAD] px-3 py-1 text-xs font-black border border-[#56CDAD]/20 hover:bg-[#56CDAD]/20 transition-all"
                >
                  {t}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
              {selectedExperience.map(e => (
                <button
                  key={e}
                  onClick={() => toggleExperience(e)}
                  className="flex items-center gap-1.5 bg-[#FFB836]/10 text-[#FFB836] px-3 py-1 text-xs font-black border border-[#FFB836]/20 hover:bg-[#FFB836]/20 transition-all"
                >
                  {e}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
              <button
                onClick={clearAll}
                className="text-[#515B6F] hover:text-[#25324B] text-xs font-black underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <section className="px-6 md:px-32 py-12 max-w-[1440px] mx-auto">
        <div className="flex gap-10 items-start">

          {/* ── Sidebar Filter ─────────────────────────────────────────── */}
          {/* Mobile filter toggle */}
          <div className="md:hidden w-full mb-4">
            <button
              id="mobile-filter-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 border border-[#D6DDEB] px-5 py-3 text-[#25324B] font-bold text-sm hover:border-[#4640DE] transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-[#4640DE] text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <aside className={`w-full md:w-72 flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>

            {/* Category filter */}
            <div className="pb-8 mb-8 border-b border-[#D6DDEB]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black text-[#25324B]">Type of Employment</h3>
              </div>
              <div className="space-y-4">
                {JOB_TYPES.map(type => (
                  <label
                    key={type.label}
                    className="flex items-center gap-3 cursor-pointer group"
                    id={`filter-type-${type.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div
                      className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selectedJobTypes.includes(type.label)
                          ? 'bg-[#4640DE] border-[#4640DE]'
                          : 'border-[#D6DDEB] group-hover:border-[#4640DE]'
                      }`}
                      onClick={() => toggleJobType(type.label)}
                    >
                      {selectedJobTypes.includes(type.label) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="text-[#515B6F] font-medium text-base group-hover:text-[#25324B] transition-colors"
                      onClick={() => toggleJobType(type.label)}
                    >
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div className="pb-8 mb-8 border-b border-[#D6DDEB]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black text-[#25324B]">Category</h3>
              </div>
              <div className="space-y-4">
                {CATEGORIES.map(cat => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer group"
                    id={`filter-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div
                      className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selectedCategories.includes(cat)
                          ? 'bg-[#4640DE] border-[#4640DE]'
                          : 'border-[#D6DDEB] group-hover:border-[#4640DE]'
                      }`}
                      onClick={() => toggleCategory(cat)}
                    >
                      {selectedCategories.includes(cat) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="text-[#515B6F] font-medium text-base group-hover:text-[#25324B] transition-colors flex-1"
                      onClick={() => toggleCategory(cat)}
                    >
                      {cat}
                    </span>
                    <span className="text-[#515B6F] text-sm font-bold opacity-50">
                      ({allJobs.filter(j => j.category?.toLowerCase() === cat.toLowerCase()).length})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level filter */}
            <div className="pb-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black text-[#25324B]">Experience Level</h3>
              </div>
              <div className="space-y-4">
                {EXPERIENCE_LEVELS.map(exp => (
                  <label
                    key={exp}
                    className="flex items-center gap-3 cursor-pointer group"
                    id={`filter-exp-${exp.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div
                      className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selectedExperience.includes(exp)
                          ? 'bg-[#4640DE] border-[#4640DE]'
                          : 'border-[#D6DDEB] group-hover:border-[#4640DE]'
                      }`}
                      onClick={() => toggleExperience(exp)}
                    >
                      {selectedExperience.includes(exp) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="text-[#515B6F] font-medium text-base group-hover:text-[#25324B] transition-colors"
                      onClick={() => toggleExperience(exp)}
                    >
                      {exp}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button
                id="clear-all-filters"
                onClick={clearAll}
                className="w-full border-2 border-[#4640DE] text-[#4640DE] font-black py-3 hover:bg-[#4640DE] hover:text-white transition-all text-sm tracking-wide"
              >
                Clear All Filters
              </button>
            )}
          </aside>

          {/* ── Job Listings ────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-[#25324B]">
                  All Jobs
                </h2>
                <p className="text-[#515B6F] font-medium mt-1">
                  {loading ? 'Loading...' : `${filtered.length} job${filtered.length !== 1 ? 's' : ''} found`}
                </p>
              </div>

              <div className="flex items-center gap-3 text-[#515B6F] text-sm">
                <span className="font-medium hidden md:block">Sort by:</span>
                <select
                  className="border border-[#D6DDEB] px-3 py-2 text-[#25324B] font-bold text-sm outline-none focus:border-[#4640DE] bg-white cursor-pointer"
                  id="jobs-sort-select"
                  defaultValue="newest"
                >
                  <option value="newest">Most Relevant</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="border border-[#D6DDEB] p-6 md:p-8 flex gap-6 animate-pulse">
                    <div className="w-16 h-16 bg-[#F8F8FD] rounded-sm flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-[#F8F8FD] rounded w-1/2" />
                      <div className="h-4 bg-[#F8F8FD] rounded w-1/3" />
                      <div className="flex gap-2 mt-4">
                        <div className="h-6 w-20 bg-[#F8F8FD] rounded-full" />
                        <div className="h-6 w-20 bg-[#F8F8FD] rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Job cards */}
            {!loading && filtered.length > 0 && (
              <div className="space-y-4">
                {filtered.map(job => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="border border-dashed border-[#D6DDEB] py-24 text-center">
                <div className="w-20 h-20 bg-[#F8F8FD] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[#D6DDEB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-[#25324B] text-2xl font-black mb-3">No jobs found</p>
                <p className="text-[#515B6F] text-lg font-medium mb-8">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  id="empty-clear-btn"
                  onClick={clearAll}
                  className="bg-[#4640DE] text-white font-black px-10 py-4 hover:bg-[#342FBF] transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Back to Home */}
            {!loading && (
              <div className="mt-16 pt-12 border-t border-[#F1F1F1] flex justify-between items-center">
                <Link
                  href="/"
                  id="back-to-home"
                  className="flex items-center gap-2 text-[#515B6F] hover:text-[#25324B] font-bold transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
                <p className="text-[#515B6F] text-sm font-medium opacity-60">
                  Showing {filtered.length} of {allJobs.length} jobs
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="bg-white min-h-screen pt-28 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#4640DE]" />
      </div>
    }>
      <JobsPageInner />
    </Suspense>
  );
}
