'use client';

import { useState, useEffect } from 'react';
import { Job, JobFormData } from '@/types';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Application {
  _id: string;
  job_id: { _id: string; title: string; company: string; location: string } | null;
  name: string;
  email: string;
  resume_link: string;
  cover_note: string;
  createdAt: string;
}

interface Banner {
  type: 'success' | 'error';
  message: string;
}

const EMPTY_FORM: JobFormData = {
  title: '',
  company: '',
  location: '',
  category: 'Design',
  description: '',
};

const CATEGORIES = ['Design', 'Engineering', 'Marketing', 'Technology', 'Human Resource', 'Finance', 'Business', 'Sales'];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editForm, setEditForm] = useState<JobFormData>(EMPTY_FORM);
  const [editErrors, setEditErrors] = useState<Partial<JobFormData>>({});
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<JobFormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<JobFormData>>({});

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 4000);
    return () => clearTimeout(t);
  }, [banner]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch {
      setBanner({ type: 'error', message: 'Failed to load jobs. Is the server running?' });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/applications`);
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch { /* silent */ }
    finally { setAppsLoading(false); }
  };

  const validateForm = (data: JobFormData, setErrors: (e: Partial<JobFormData>) => void): boolean => {
    const errors: Partial<JobFormData> = {};
    if (!data.title.trim()) errors.title = 'Job title is required';
    if (!data.company.trim()) errors.company = 'Company name is required';
    if (!data.location.trim()) errors.location = 'Location is required';
    if (!data.description.trim()) errors.description = 'Description is required';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(formData, setFormErrors)) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        await fetchJobs();
        setShowAdd(false);
        setFormData(EMPTY_FORM);
        setFormErrors({});
        setBanner({ type: 'success', message: `"${data.title}" has been posted successfully!` });
      } else {
        setBanner({ type: 'error', message: data.message || 'Failed to create job.' });
      }
    } catch {
      setBanner({ type: 'error', message: 'Server error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    if (!validateForm(editForm, setEditErrors)) return;
    setEditSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/jobs/${editingJob._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setJobs(prev => prev.map(j => j._id === editingJob._id ? data : j));
        setEditingJob(null);
        setEditForm(EMPTY_FORM);
        setEditErrors({});
        setBanner({ type: 'success', message: `"${data.title}" has been updated successfully!` });
      } else {
        setBanner({ type: 'error', message: data.message || 'Failed to update job.' });
      }
    } catch {
      setBanner({ type: 'error', message: 'Server error. Please try again.' });
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setConfirmDeleteId(null);
    try {
      const res = await fetch(`${API_BASE}/api/jobs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setJobs(prev => prev.filter(j => j._id !== id));
        setBanner({ type: 'success', message: 'Job listing deleted successfully.' });
        if (editingJob?._id === id) setEditingJob(null);
      } else {
        setBanner({ type: 'error', message: data.message || 'Failed to delete job.' });
      }
    } catch {
      setBanner({ type: 'error', message: 'Server error. Please try again.' });
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (job: Job) => {
    setEditingJob(job);
    setEditForm({ title: job.title, company: job.company, location: job.location, category: job.category, description: job.description });
    setEditErrors({});
    setShowAdd(false);
    setConfirmDeleteId(null);
    // Scroll to the edit area
    setTimeout(() => document.getElementById('edit-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  // Reusable field renderer
  const renderField = (
    label: string, id: string, value: string,
    onChange: (v: string) => void, error: string | undefined,
    placeholder: string, type: 'input' | 'textarea' | 'select' = 'input'
  ) => (
    <div>
      <label htmlFor={id} className="block text-[#25324B] font-bold mb-2 text-sm">
        {label} <span className="text-red-500">*</span>
      </label>
      {type === 'textarea' ? (
        <textarea id={id} rows={6} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full p-4 border outline-none transition-all text-[#25324B] font-medium placeholder:text-[#CED4DE] bg-[#F8F8FD] focus:bg-white resize-none ${error ? 'border-red-400' : 'border-[#D6DDEB] focus:border-[#4640DE]'}`}
        />
      ) : type === 'select' ? (
        <select id={id} value={value} onChange={e => onChange(e.target.value)}
          className="w-full p-4 border border-[#D6DDEB] focus:border-[#4640DE] outline-none bg-[#F8F8FD] focus:bg-white font-bold text-[#25324B] transition-all cursor-pointer"
        >
          {CATEGORIES.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input id={id} type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full p-4 border outline-none transition-all text-[#25324B] font-medium placeholder:text-[#CED4DE] bg-[#F8F8FD] focus:bg-white ${error ? 'border-red-400' : 'border-[#D6DDEB] focus:border-[#4640DE]'}`}
        />
      )}
      {error && <p className="text-red-500 text-xs font-bold mt-1.5">{error}</p>}
    </div>
  );

  const submitBtnCls = "flex-1 bg-[#4640DE] text-white font-black py-5 hover:bg-[#342FBF] disabled:bg-[#D6DDEB] disabled:text-[#515B6F] transition-all flex items-center justify-center gap-3 text-base";
  const cancelBtnCls = "px-10 py-5 border-2 border-[#D6DDEB] text-[#515B6F] font-black hover:border-[#25324B] hover:text-[#25324B] transition-all";

  return (
    <div className="bg-[#F8F8FD] min-h-screen pt-20 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 py-6 text-sm text-[#515B6F] font-medium">
          <Link href="/" className="hover:text-[#4640DE] transition-colors">Home</Link>
          <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[#25324B] font-bold">Admin Dashboard</span>
        </div>

        {/* Banner */}
        {banner && (
          <div className={`flex items-center gap-4 px-6 py-4 mb-6 font-bold text-sm ${banner.type === 'success' ? 'bg-[#56CDAD]/10 border border-[#56CDAD]/30 text-[#2e7d5a]' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {banner.type === 'success'
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              }
            </svg>
            <span className="flex-1">{banner.message}</span>
            <button onClick={() => setBanner(null)} className="opacity-60 hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#25324B]">Admin Dashboard</h1>
            <p className="text-[#515B6F] mt-1 font-medium">Manage job listings and review applicants.</p>
          </div>
          {activeTab === 'jobs' && (
            <button
              id="toggle-add-job-btn"
              onClick={() => { setShowAdd(!showAdd); setFormData(EMPTY_FORM); setFormErrors({}); setEditingJob(null); }}
              className={`flex items-center gap-2 font-black px-8 py-4 transition-all shadow-lg text-base ${showAdd ? 'bg-[#515B6F] text-white hover:bg-[#25324B] shadow-gray-300/50' : 'bg-[#4640DE] text-white hover:bg-[#342FBF] shadow-[#4640DE]/30'}`}
            >
              {showAdd ? (
                <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>Cancel</>
              ) : (
                <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>Post New Job</>
              )}
            </button>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Jobs', value: jobs.length, icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'text-[#4640DE] bg-[#4640DE]/10' },
            { label: 'Applications', value: applications.length, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'text-[#56CDAD] bg-[#56CDAD]/10' },
            { label: 'Categories', value: [...new Set(jobs.map(j => j.category))].length, icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', color: 'text-[#FFB836] bg-[#FFB836]/10' },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-[#D6DDEB] p-5 flex items-center gap-4">
              <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={stat.icon} />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-black text-[#25324B]">{loading ? '–' : stat.value}</p>
                <p className="text-[#515B6F] text-sm font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-6 border-b-2 border-[#D6DDEB]">
          {(['jobs', 'applications'] as const).map(tab => (
            <button
              key={tab}
              id={`tab-${tab}`}
              onClick={() => { setActiveTab(tab); setShowAdd(false); setEditingJob(null); }}
              className={`px-8 py-4 font-black text-sm uppercase tracking-wide transition-all border-b-2 -mb-[2px] ${activeTab === tab ? 'border-[#4640DE] text-[#4640DE] bg-white' : 'border-transparent text-[#515B6F] hover:text-[#25324B]'}`}
            >
              {tab === 'jobs' ? 'Job Listings' : 'Applications'}
              <span className={`ml-2 px-2 py-0.5 text-xs font-black rounded-full ${activeTab === tab ? 'bg-[#4640DE] text-white' : 'bg-[#F1F1F1] text-[#515B6F]'}`}>
                {tab === 'jobs' ? jobs.length : applications.length}
              </span>
            </button>
          ))}
        </div>

        {/* ── JOBS TAB ── */}
        {activeTab === 'jobs' && (
          <>
            {/* ── Add Job Form ── */}
            {showAdd && (
              <div className="bg-white border-2 border-[#4640DE] p-8 md:p-10 mb-6 shadow-2xl shadow-[#4640DE]/10">
                <h2 className="text-2xl font-black text-[#25324B] mb-8">Post a New Job Listing</h2>
                <form onSubmit={handleCreate} id="post-job-form" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderField('Job Title', 'new-title', formData.title, v => { setFormData(p => ({...p, title: v})); setFormErrors(p => ({...p, title: ''})); }, formErrors.title, 'e.g. Senior Product Designer')}
                    {renderField('Company Name', 'new-company', formData.company, v => { setFormData(p => ({...p, company: v})); setFormErrors(p => ({...p, company: ''})); }, formErrors.company, 'e.g. Acme Corp')}
                    {renderField('Location', 'new-location', formData.location, v => { setFormData(p => ({...p, location: v})); setFormErrors(p => ({...p, location: ''})); }, formErrors.location, 'e.g. Remote, New York')}
                    {renderField('Category', 'new-category', formData.category, v => setFormData(p => ({...p, category: v})), undefined, '', 'select')}
                  </div>
                  {renderField('Job Description', 'new-description', formData.description, v => { setFormData(p => ({...p, description: v})); setFormErrors(p => ({...p, description: ''})); }, formErrors.description, 'Describe the role, responsibilities, and requirements...', 'textarea')}
                  <div className="flex flex-col md:flex-row gap-4 pt-2">
                    <button type="submit" id="submit-job-btn" disabled={submitting} className={submitBtnCls}>
                      {submitting ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Posting...</> : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>Post Job</>}
                    </button>
                    <button type="button" onClick={() => { setShowAdd(false); setFormData(EMPTY_FORM); setFormErrors({}); }} className={cancelBtnCls}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* ── Edit Job Form ── */}
            {editingJob && (
              <div id="edit-form-section" className="bg-white border-2 border-[#FFB836] p-8 md:p-10 mb-6 shadow-2xl shadow-[#FFB836]/10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-[#25324B]">Edit Job Listing</h2>
                    <p className="text-[#515B6F] font-medium mt-1">Updating: <span className="font-black text-[#25324B]">{editingJob.title}</span> at {editingJob.company}</p>
                  </div>
                  <button
                    onClick={() => { setEditingJob(null); setEditErrors({}); }}
                    className="w-10 h-10 flex items-center justify-center border border-[#D6DDEB] hover:border-red-300 hover:text-red-500 transition-all text-[#515B6F]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleUpdate} id="edit-job-form" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderField('Job Title', 'edit-title', editForm.title, v => { setEditForm(p => ({...p, title: v})); setEditErrors(p => ({...p, title: ''})); }, editErrors.title, 'e.g. Senior Product Designer')}
                    {renderField('Company Name', 'edit-company', editForm.company, v => { setEditForm(p => ({...p, company: v})); setEditErrors(p => ({...p, company: ''})); }, editErrors.company, 'e.g. Acme Corp')}
                    {renderField('Location', 'edit-location', editForm.location, v => { setEditForm(p => ({...p, location: v})); setEditErrors(p => ({...p, location: ''})); }, editErrors.location, 'e.g. Remote, New York')}
                    {renderField('Category', 'edit-category', editForm.category, v => setEditForm(p => ({...p, category: v})), undefined, '', 'select')}
                  </div>
                  {renderField('Job Description', 'edit-description', editForm.description, v => { setEditForm(p => ({...p, description: v})); setEditErrors(p => ({...p, description: ''})); }, editErrors.description, 'Describe the role, responsibilities, and requirements...', 'textarea')}
                  <div className="flex flex-col md:flex-row gap-4 pt-2">
                    <button type="submit" id="save-edit-btn" disabled={editSubmitting}
                      className="flex-1 bg-[#FFB836] text-white font-black py-5 hover:bg-[#e6a42e] disabled:bg-[#D6DDEB] disabled:text-[#515B6F] transition-all flex items-center justify-center gap-3 text-base"
                    >
                      {editSubmitting ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>Save Changes</>}
                    </button>
                    <button type="button" onClick={() => { setEditingJob(null); setEditErrors({}); }} className={cancelBtnCls}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* ── Jobs Table ── */}
            <div className="bg-white border border-[#D6DDEB] overflow-hidden">
              {loading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-[#D6DDEB] border-t-[#4640DE] rounded-full animate-spin" />
                  <p className="text-[#515B6F] font-bold">Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 bg-[#F8F8FD] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#D6DDEB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-[#25324B] font-black text-xl mb-1">No job listings yet</p>
                  <p className="text-[#515B6F] font-medium mb-6">Click "Post New Job" to add your first listing.</p>
                  <button onClick={() => setShowAdd(true)} className="bg-[#4640DE] text-white font-black px-8 py-3 hover:bg-[#342FBF] transition-all">
                    Post New Job
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#F8F8FD] border-b-2 border-[#D6DDEB]">
                      <tr>
                        {['Job Listing', 'Category', 'Posted', 'Actions'].map((h, i) => (
                          <th key={h} className={`px-6 py-4 text-[#25324B] font-black text-xs uppercase tracking-wider ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F1F1]">
                      {jobs.map(job => (
                        <tr
                          key={job._id}
                          className={`transition-colors ${editingJob?._id === job._id ? 'bg-[#FFB836]/5 border-l-4 border-l-[#FFB836]' : 'hover:bg-[#F8F8FD]'}`}
                        >
                          <td className="px-6 py-5">
                            <div className="font-black text-[#25324B] text-base">{job.title}</div>
                            <div className="text-[#515B6F] text-sm font-medium opacity-70 mt-0.5">{job.company} · {job.location}</div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="bg-[#4640DE]/10 text-[#4640DE] px-3 py-1 text-xs font-black border border-[#4640DE]/20 uppercase tracking-wide">
                              {job.category}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-[#515B6F] text-sm font-medium">
                            {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-5 text-right">
                            {confirmDeleteId === job._id ? (
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-[#515B6F] text-xs font-bold hidden md:block">Delete?</span>
                                <button
                                  id={`confirm-delete-${job._id}`}
                                  onClick={() => handleDelete(job._id)}
                                  disabled={deletingId === job._id}
                                  className="bg-red-500 text-white font-black text-xs px-4 py-2 hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-1.5"
                                >
                                  {deletingId === job._id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Yes, Delete'}
                                </button>
                                <button onClick={() => setConfirmDeleteId(null)} className="border border-[#D6DDEB] text-[#515B6F] font-black text-xs px-4 py-2 hover:border-[#25324B] transition-all">
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/jobs/${job._id}`}
                                  target="_blank"
                                  className="text-[#4640DE] font-bold text-xs px-3 py-2 border border-[#4640DE]/20 hover:bg-[#4640DE] hover:text-white transition-all hidden md:flex items-center gap-1"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  View
                                </Link>
                                <button
                                  id={`edit-job-${job._id}`}
                                  onClick={() => editingJob?._id === job._id ? setEditingJob(null) : startEdit(job)}
                                  className={`font-bold text-xs px-4 py-2 border transition-all ${editingJob?._id === job._id ? 'bg-[#FFB836] text-white border-[#FFB836]' : 'text-[#FFB836] border-[#FFB836]/30 hover:bg-[#FFB836] hover:text-white hover:border-[#FFB836]'}`}
                                >
                                  {editingJob?._id === job._id ? 'Editing…' : 'Edit'}
                                </button>
                                <button
                                  id={`delete-job-${job._id}`}
                                  onClick={() => setConfirmDeleteId(job._id)}
                                  className="text-red-500 font-bold text-xs px-4 py-2 border border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── APPLICATIONS TAB ── */}
        {activeTab === 'applications' && (
          <div className="bg-white border border-[#D6DDEB] overflow-hidden">
            {appsLoading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-[#D6DDEB] border-t-[#4640DE] rounded-full animate-spin" />
                <p className="text-[#515B6F] font-bold">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-[#F8F8FD] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#D6DDEB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-[#25324B] font-black text-xl mb-1">No applications yet</p>
                <p className="text-[#515B6F] font-medium">Applications will appear here once candidates start applying.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#F8F8FD] border-b-2 border-[#D6DDEB]">
                    <tr>
                      {['Applicant', 'Job Applied For', 'Cover Note', 'Resume', 'Applied'].map(h => (
                        <th key={h} className="px-6 py-4 text-[#25324B] font-black text-xs uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F1F1]">
                    {applications.map(app => (
                      <tr key={app._id} className="hover:bg-[#F8F8FD] transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#4640DE] text-white font-black text-base flex items-center justify-center flex-shrink-0">
                              {app.name[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="font-black text-[#25324B] text-sm">{app.name}</div>
                              <div className="text-[#515B6F] text-xs font-medium opacity-70">{app.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {app.job_id ? (
                            <div>
                              <div className="font-bold text-[#25324B] text-sm">{app.job_id.title}</div>
                              <div className="text-[#515B6F] text-xs opacity-70">{app.job_id.company} · {app.job_id.location}</div>
                            </div>
                          ) : (
                            <span className="text-[#515B6F] text-xs italic opacity-60">Job deleted</span>
                          )}
                        </td>
                        <td className="px-6 py-5 max-w-xs">
                          <p className="text-[#515B6F] text-xs font-medium line-clamp-2 leading-relaxed">{app.cover_note}</p>
                        </td>
                        <td className="px-6 py-5">
                          <a href={app.resume_link} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[#4640DE] font-bold text-xs hover:underline whitespace-nowrap"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View Resume
                          </a>
                        </td>
                        <td className="px-6 py-5 text-[#515B6F] text-xs font-medium whitespace-nowrap">
                          {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
