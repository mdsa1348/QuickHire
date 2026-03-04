'use client';

import { useState, useEffect } from 'react';
import { Job, JobFormData } from '@/types';

interface Application {
  _id: string;
  job_id: { _id: string; title: string; company: string; location: string } | null;
  name: string;
  email: string;
  resume_link: string;
  cover_note: string;
  createdAt: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    category: 'Design',
    description: '',
  });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/applications');
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setAppsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchJobs();
        setShowAdd(false);
        setFormData({ title: '', company: '', location: '', category: 'Design', description: '' });
      }
    } catch (err) {
      alert('Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchJobs();
      }
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  return (
    <div className="bg-primary-light min-h-screen pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-text-dark">Admin Dashboard</h1>
            <p className="text-text-gray mt-2 text-lg">Manage job listings and applications.</p>
          </div>
          {activeTab === 'jobs' && (
            <button 
              onClick={() => setShowAdd(!showAdd)}
              className="bg-primary text-white font-black px-8 py-4 rounded-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all"
            >
              {showAdd ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                  Post a new job
                </>
              )}
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-8 border-b border-border">
          <button
            onClick={() => { setActiveTab('jobs'); setShowAdd(false); }}
            className={`px-8 py-4 font-black text-base transition-all border-b-2 -mb-px ${
              activeTab === 'jobs'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent text-text-gray hover:text-text-dark'
            }`}
          >
            Job Listings
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-black ${activeTab === 'jobs' ? 'bg-primary text-white' : 'bg-gray-100 text-text-gray'}`}>
              {jobs.length}
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('applications'); setShowAdd(false); }}
            className={`px-8 py-4 font-black text-base transition-all border-b-2 -mb-px ${
              activeTab === 'applications'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent text-text-gray hover:text-text-dark'
            }`}
          >
            Applications
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-black ${activeTab === 'applications' ? 'bg-primary text-white' : 'bg-gray-100 text-text-gray'}`}>
              {applications.length}
            </span>
          </button>
        </div>

        {/* ── Jobs Tab ── */}
        {activeTab === 'jobs' && (
          <>
            {showAdd && (
              <div className="bg-white p-8 md:p-12 mb-8 border-2 border-primary shadow-2xl rounded-sm">
                <h2 className="text-3xl font-black text-text-dark mb-8">Post a new job listing</h2>
                <form onSubmit={handleCreate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-text-dark font-bold mb-2">Job Title</label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-4 border border-border rounded-sm outline-none focus:border-primary bg-gray-50 transition-all"
                        placeholder="e.g. Senior Product Designer"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-text-dark font-bold mb-2">Company Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-4 border border-border rounded-sm outline-none focus:border-primary bg-gray-50 transition-all"
                        placeholder="e.g. Acme Corp"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-text-dark font-bold mb-2">Location</label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-4 border border-border rounded-sm outline-none focus:border-primary bg-gray-50 transition-all"
                        placeholder="e.g. Remote, SF, NYC"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-text-dark font-bold mb-2">Category</label>
                      <select 
                        className="w-full p-4 border border-border rounded-sm outline-none focus:border-primary bg-gray-50 font-bold transition-all"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                        <option>Design</option>
                        <option>Engineering</option>
                        <option>Marketing</option>
                        <option>Technology</option>
                        <option>Human Resource</option>
                        <option>Finance</option>
                        <option>Business</option>
                        <option>Sales</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-text-dark font-bold mb-2">Job Description</label>
                    <textarea 
                      required
                      rows={8}
                      className="w-full p-4 border border-border rounded-sm outline-none focus:border-primary bg-gray-50 transition-all"
                      placeholder="Describe the role, responsibilities, and requirements..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-white font-black py-4 rounded-sm transition-all hover:bg-opacity-90 disabled:bg-gray-400 text-lg shadow-lg shadow-primary/20"
                  >
                    {submitting ? 'Posting...' : 'Post Job'}
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white border border-border rounded-sm shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-border">
                  <tr>
                    <th className="px-8 py-5 text-text-dark font-black tracking-wider uppercase text-sm">Job Listing</th>
                    <th className="px-8 py-5 text-text-dark font-black tracking-wider uppercase text-sm">Category</th>
                    <th className="px-8 py-5 text-text-dark font-black tracking-wider uppercase text-sm">Created At</th>
                    <th className="px-8 py-5 text-text-dark font-black tracking-wider uppercase text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-text-gray font-bold">Loading...</td>
                    </tr>
                  ) : jobs.length > 0 ? (
                    jobs.map(job => (
                      <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-bold text-text-dark text-lg">{job.title}</div>
                          <div className="text-text-gray text-sm">{job.company} • {job.location}</div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="bg-primary-light text-primary px-3 py-1 rounded-full text-xs font-black border border-primary/10 tracking-wider">
                            {job.category}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-text-gray font-medium">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => handleDelete(job._id)}
                            className="text-red-500 font-bold hover:text-red-700 transition-colors px-4 py-2 border border-red-100 hover:border-red-300 rounded-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-text-gray font-bold">No jobs posted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── Applications Tab ── */}
        {activeTab === 'applications' && (
          <div className="bg-white border border-border rounded-sm shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="px-8 py-5 text-text-dark font-black tracking-wider uppercase text-sm">Applicant</th>
                  <th className="px-8 py-5 text-text-dark font-black tracking-wider uppercase text-sm">Job Applied</th>
                  <th className="px-8 py-5 text-text-dark font-black tracking-wider uppercase text-sm">Resume</th>
                  <th className="px-8 py-5 text-text-dark font-black tracking-wider uppercase text-sm">Applied At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appsLoading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-text-gray font-bold">Loading...</td>
                  </tr>
                ) : applications.length > 0 ? (
                  applications.map(app => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-text-dark text-base">{app.name}</div>
                        <div className="text-text-gray text-sm">{app.email}</div>
                        {app.cover_note && (
                          <p className="text-text-gray text-xs mt-1 max-w-xs line-clamp-2 opacity-70">{app.cover_note}</p>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        {app.job_id ? (
                          <div>
                            <div className="font-bold text-text-dark">{app.job_id.title}</div>
                            <div className="text-text-gray text-sm">{app.job_id.company} • {app.job_id.location}</div>
                          </div>
                        ) : (
                          <span className="text-text-gray text-sm italic">Job deleted</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <a 
                          href={app.resume_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary font-bold hover:underline flex items-center gap-1.5 text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                          View Resume
                        </a>
                      </td>
                      <td className="px-8 py-6 text-text-gray font-medium text-sm">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-text-gray font-bold">No applications submitted yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
