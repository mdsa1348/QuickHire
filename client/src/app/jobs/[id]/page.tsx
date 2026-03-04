'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Job, ApplicationFormData } from '@/types';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function JobDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    resume_link: '',
    cover_note: '',
  });
  const [errors, setErrors] = useState<Partial<ApplicationFormData>>({});

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs/${id}`);
        if (!res.ok) throw new Error('Job not found');
        const data = await res.json();
        setJob(data);
      } catch {
        router.push('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, router]);

  const validate = () => {
    const newErrors: Partial<ApplicationFormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.resume_link.trim()) newErrors.resume_link = 'Resume link is required';
    else {
      try { new URL(formData.resume_link); } catch { newErrors.resume_link = 'Enter a valid URL'; }
    }
    if (!formData.cover_note.trim()) newErrors.cover_note = 'Cover note is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitStatus('idle');
    try {
      const res = await fetch(`${API_BASE}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, job_id: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus('success');
        setSubmitMessage("Your application was submitted successfully! We'll be in touch.");
        setFormData({ name: '', email: '', resume_link: '', cover_note: '' });
        setErrors({});
        setTimeout(() => setShowApply(false), 4000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitStatus('error');
      setSubmitMessage('Failed to connect to the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getBrandColor = (company: string) => {
    const map: Record<string, string> = {
      Nomad: '#FF4F00', Netlify: '#00AD9F', Dropbox: '#0061FF',
      Maze: '#191C1F', Terraform: '#5C4EE5', Udacity: '#01B3E3',
      Packer: '#191C1F', Webflow: '#4353FF',
    };
    return map[company] || '#4640DE';
  };

  if (loading) return (
    <div className="bg-[#F8F8FD] min-h-screen pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Skeleton */}
        <div className="animate-pulse">
          <div className="bg-white border border-[#D6DDEB] p-8 md:p-12 mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-[#F8F8FD] rounded-sm" />
              <div className="flex-1 space-y-3">
                <div className="h-7 bg-[#F8F8FD] rounded w-1/2" />
                <div className="h-5 bg-[#F8F8FD] rounded w-1/3" />
                <div className="h-4 bg-[#F8F8FD] rounded w-1/4" />
              </div>
              <div className="h-14 w-40 bg-[#F8F8FD] rounded-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[1,2,3,4,5].map(i => <div key={i} className="h-5 bg-white rounded w-full border border-[#D6DDEB]" />)}
            </div>
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="bg-white border border-[#D6DDEB] h-16 rounded-sm" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!job) return null;

  const responsibilities = [
    'Collaborate with cross-functional teams to define and ship new features.',
    'Write clean, maintainable, and efficient code.',
    'Participate in code reviews and contribute to architectural decisions.',
    'Troubleshoot and debug production issues effectively.',
    'Engage with stakeholders to understand requirements and translate them into technical solutions.',
  ];

  const requirements = [
    '3+ years of relevant professional experience.',
    'Strong portfolio demonstrating past projects and results.',
    'Excellent communication and collaboration skills.',
    'Experience working in agile/scrum environments.',
    'Ability to manage multiple priorities and meet deadlines.',
  ];

  return (
    <div className="bg-[#F8F8FD] min-h-screen pt-20 pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-12">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 py-6 text-sm text-[#515B6F] font-medium">
          <Link href="/" className="hover:text-[#4640DE] transition-colors">Home</Link>
          <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/jobs" className="hover:text-[#4640DE] transition-colors">Find Jobs</Link>
          <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[#25324B] font-bold truncate max-w-[200px]">{job.title}</span>
        </div>

        {/* Job Header Card */}
        <div className="bg-white border border-[#D6DDEB] p-8 md:p-10 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            <div className="flex items-center gap-6">
              <div
                className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center text-2xl md:text-3xl font-black text-white shadow-lg"
                style={{ backgroundColor: getBrandColor(job.company) }}
              >
                {job.company[0]}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#25324B] mb-1">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-2 text-[#515B6F] font-medium text-base opacity-80">
                  <span className="font-bold">{job.company}</span>
                  <span className="w-1 h-1 bg-[#515B6F] rounded-full opacity-50" />
                  <span>{job.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-[#56CDAD]/10 text-[#56CDAD] px-4 py-1 text-xs font-black tracking-wider uppercase rounded-full">
                    Full-Time
                  </span>
                  <span className="bg-[#4640DE]/10 text-[#4640DE] px-4 py-1 text-xs font-black tracking-wider uppercase rounded-full">
                    {job.category}
                  </span>
                </div>
              </div>
            </div>

            {!showApply && (
              <button
                id="apply-now-btn"
                onClick={() => { setShowApply(true); setSubmitStatus('idle'); }}
                className="bg-[#4640DE] text-white font-black px-10 py-4 md:py-5 hover:bg-[#342FBF] transition-all w-full md:w-auto text-base shadow-lg shadow-[#4640DE]/20 flex-shrink-0"
              >
                Apply Now →
              </button>
            )}
          </div>
        </div>

        {/* Application Form – inline, full width */}
        {showApply && (
          <div id="apply-form-section" className="bg-white border-2 border-[#4640DE] p-8 md:p-10 mb-6 shadow-2xl shadow-[#4640DE]/10">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-[#25324B]">Apply for this position</h2>
                <p className="text-[#515B6F] mt-1 font-medium">
                  {job.title} at {job.company} · {job.location}
                </p>
              </div>
              <button
                onClick={() => { setShowApply(false); setSubmitStatus('idle'); }}
                className="w-10 h-10 flex items-center justify-center border border-[#D6DDEB] hover:border-red-300 hover:text-red-500 transition-all text-[#515B6F] flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Success State */}
            {submitStatus === 'success' && (
              <div className="bg-[#56CDAD]/10 border border-[#56CDAD]/30 p-6 mb-6 flex items-start gap-4">
                <div className="w-10 h-10 bg-[#56CDAD] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-black text-[#25324B] text-lg">Application Submitted! 🎉</p>
                  <p className="text-[#515B6F] font-medium mt-1">{submitMessage}</p>
                  <p className="text-[#515B6F] text-sm mt-2 opacity-70">This form will close automatically...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 p-5 mb-6 flex items-center gap-4">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-bold">{submitMessage}</p>
              </div>
            )}

            {submitStatus !== 'success' && (
              <form onSubmit={handleSubmit} className="space-y-6" id="application-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-[#25324B] font-bold mb-2 text-sm">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="applicant-name"
                      className={`w-full p-4 border outline-none transition-all text-[#25324B] font-medium placeholder:text-[#CED4DE] bg-[#F8F8FD] focus:bg-white ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-[#D6DDEB] focus:border-[#4640DE]'}`}
                      placeholder="e.g. John Smith"
                      value={formData.name}
                      onChange={e => { setFormData({...formData, name: e.target.value}); setErrors({...errors, name: ''}); }}
                    />
                    {errors.name && <p className="text-red-500 text-xs font-bold mt-1.5">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[#25324B] font-bold mb-2 text-sm">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="applicant-email"
                      className={`w-full p-4 border outline-none transition-all text-[#25324B] font-medium placeholder:text-[#CED4DE] bg-[#F8F8FD] focus:bg-white ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-[#D6DDEB] focus:border-[#4640DE]'}`}
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={e => { setFormData({...formData, email: e.target.value}); setErrors({...errors, email: ''}); }}
                    />
                    {errors.email && <p className="text-red-500 text-xs font-bold mt-1.5">{errors.email}</p>}
                  </div>
                </div>

                {/* Resume Link */}
                <div>
                  <label className="block text-[#25324B] font-bold mb-2 text-sm">
                    Resume / CV Link <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#515B6F] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <input
                      type="url"
                      id="applicant-resume"
                      className={`w-full pl-12 pr-4 py-4 border outline-none transition-all text-[#25324B] font-medium placeholder:text-[#CED4DE] bg-[#F8F8FD] focus:bg-white ${errors.resume_link ? 'border-red-400 focus:border-red-500' : 'border-[#D6DDEB] focus:border-[#4640DE]'}`}
                      placeholder="https://drive.google.com/your-resume"
                      value={formData.resume_link}
                      onChange={e => { setFormData({...formData, resume_link: e.target.value}); setErrors({...errors, resume_link: ''}); }}
                    />
                  </div>
                  {errors.resume_link && <p className="text-red-500 text-xs font-bold mt-1.5">{errors.resume_link}</p>}
                  <p className="text-[#515B6F] text-xs mt-1.5 opacity-70">Link to your Google Drive, Dropbox, personal website, or LinkedIn</p>
                </div>

                {/* Cover Note */}
                <div>
                  <label className="block text-[#25324B] font-bold mb-2 text-sm">
                    Cover Note <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="applicant-cover-note"
                    rows={6}
                    className={`w-full p-4 border outline-none transition-all text-[#25324B] font-medium placeholder:text-[#CED4DE] bg-[#F8F8FD] focus:bg-white resize-none ${errors.cover_note ? 'border-red-400 focus:border-red-500' : 'border-[#D6DDEB] focus:border-[#4640DE]'}`}
                    placeholder="Tell us why you're a great fit for this role. Highlight your most relevant experience and what excites you about this opportunity..."
                    value={formData.cover_note}
                    onChange={e => { setFormData({...formData, cover_note: e.target.value}); setErrors({...errors, cover_note: ''}); }}
                  />
                  {errors.cover_note && <p className="text-red-500 text-xs font-bold mt-1.5">{errors.cover_note}</p>}
                  <p className="text-[#515B6F] text-xs mt-1.5 opacity-70">{formData.cover_note.length} characters</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-2">
                  <button
                    type="submit"
                    id="submit-application-btn"
                    disabled={submitting}
                    className="flex-1 bg-[#4640DE] text-white font-black py-5 hover:bg-[#342FBF] disabled:bg-[#D6DDEB] disabled:text-[#515B6F] transition-all text-base flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                  <button
                    type="button"
                    id="cancel-application-btn"
                    onClick={() => { setShowApply(false); setSubmitStatus('idle'); setErrors({}); }}
                    className="px-10 py-5 border-2 border-[#D6DDEB] text-[#515B6F] font-black hover:border-[#25324B] hover:text-[#25324B] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Two-column layout: Description + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            <div className="bg-white border border-[#D6DDEB] p-8 md:p-10">
              <h2 className="text-xl font-black text-[#25324B] mb-5 pb-4 border-b border-[#D6DDEB]">
                Job Description
              </h2>
              <div className="text-[#515B6F] leading-relaxed text-base font-medium whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Responsibilities */}
            <div className="bg-white border border-[#D6DDEB] p-8 md:p-10">
              <h2 className="text-xl font-black text-[#25324B] mb-5 pb-4 border-b border-[#D6DDEB]">
                Responsibilities
              </h2>
              <ul className="space-y-3">
                {responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#515B6F] font-medium">
                    <div className="w-2 h-2 mt-2 bg-[#4640DE] rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white border border-[#D6DDEB] p-8 md:p-10">
              <h2 className="text-xl font-black text-[#25324B] mb-5 pb-4 border-b border-[#D6DDEB]">
                Requirements
              </h2>
              <ul className="space-y-3">
                {requirements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#515B6F] font-medium">
                    <div className="w-2 h-2 mt-2 bg-[#56CDAD] rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">

            {/* Job Overview */}
            <div className="bg-white border border-[#D6DDEB] p-6">
              <h3 className="text-base font-black text-[#25324B] mb-5 pb-4 border-b border-[#D6DDEB]">
                Job Overview
              </h3>
              <dl className="space-y-5">
                {[
                  {
                    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
                    label: 'Location', value: job.location,
                  },
                  {
                    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                    label: 'Category', value: job.category,
                  },
                  {
                    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                    label: 'Job Type', value: 'Full-Time',
                  },
                  {
                    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
                    label: 'Posted', value: new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                  },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#F8F8FD] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-[#4640DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={item.icon} />
                      </svg>
                    </div>
                    <div>
                      <dt className="text-xs font-black text-[#515B6F] opacity-60 uppercase tracking-wider">{item.label}</dt>
                      <dd className="text-[#25324B] font-bold text-sm mt-0.5">{item.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* Company Info */}
            <div className="bg-white border border-[#D6DDEB] p-6">
              <h3 className="text-base font-black text-[#25324B] mb-5 pb-4 border-b border-[#D6DDEB]">
                About {job.company}
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 flex items-center justify-center text-lg font-black text-white"
                  style={{ backgroundColor: getBrandColor(job.company) }}
                >
                  {job.company[0]}
                </div>
                <div>
                  <p className="font-black text-[#25324B]">{job.company}</p>
                  <p className="text-[#515B6F] text-sm font-medium opacity-70">{job.location}</p>
                </div>
              </div>
              <Link
                href="/jobs"
                className="flex items-center justify-center gap-2 w-full border-2 border-[#D6DDEB] py-3 text-[#515B6F] font-bold text-sm hover:border-[#4640DE] hover:text-[#4640DE] transition-all"
              >
                View all jobs at {job.company}
              </Link>
            </div>

            {/* Back link */}
            <Link
              href="/jobs"
              className="flex items-center gap-2 text-[#515B6F] hover:text-[#25324B] font-bold transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
