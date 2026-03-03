'use client';

import { useState, useEffect } from 'react';
import { Job, JobFormData } from '@/types';

export default function Admin() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-text-dark">Admin Dashboard</h1>
            <p className="text-text-gray mt-2 text-lg">Manage job listings and applications.</p>
          </div>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="bg-primary text-white font-black px-8 py-4 rounded-sm flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            {showAdd ? 'Cancel' : '+ Post a new job'}
          </button>
        </div>

        {showAdd && (
          <div className="bg-white p-8 md:p-12 mb-12 border-2 border-primary shadow-2xl rounded-sm">
            <h2 className="text-3xl font-black text-text-dark mb-8">Post a new job listing</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-dark font-bold mb-2">Job Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-4 border border-border rounded-sm outline-none focus:border-primary bg-gray-50"
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
                    className="w-full p-4 border border-border rounded-sm outline-none focus:border-primary bg-gray-50"
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
                    className="w-full p-4 border border-border rounded-sm outline-none focus:border-primary bg-gray-50"
                    placeholder="e.g. Remote, SF, NYC"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-text-dark font-bold mb-2">Category</label>
                  <select 
                    className="w-full p-4 border border-border rounded-sm outline-none focus:border-primary bg-gray-50 font-bold"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Design</option>
                    <option>Engineering</option>
                    <option>Product</option>
                    <option>Sales</option>
                    <option>Marketing</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-text-dark font-bold mb-2">Job Description</label>
                <textarea 
                  required
                  rows={8}
                  className="w-full p-4 border border-border rounded-sm outline-none focus:border-primary bg-gray-50"
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
                      <span className="bg-primary-light text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/10 tracking-wider">
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
      </div>
    </div>
  );
}
