'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Job, ApplicationFormData } from '@/types';
import Link from 'next/link';

export default function JobDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    resume_link: '',
    cover_note: '',
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/jobs/${id}`);
        if (!res.ok) throw new Error('Job not found');
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error(err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, job_id: id }),
      });
      if (res.ok) {
        alert('Application submitted successfully!');
        setShowApply(false);
        setFormData({ name: '', email: '', resume_link: '', cover_note: '' });
      } else {
        const data = await res.json();
        alert(data.message || 'Error submitting application');
      }
    } catch (err) {
      alert('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!job) return null;

  return (
    <div className="bg-primary-light min-h-screen pt-12 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to all jobs
        </Link>

        {/* Job Header */}
        <div className="bg-white p-8 md:p-12 border border-border shadow-sm rounded-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-border pb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-primary-light rounded-sm flex items-center justify-center font-bold text-3xl text-primary">
                {job.company[0]}
              </div>
              <div>
                <h1 className="text-3xl font-black text-text-dark">{job.title}</h1>
                <p className="text-xl text-text-gray mt-1">{job.company} • {job.location}</p>
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mt-2 border border-green-200 uppercase tracking-wider">
                  {job.category}
                </span>
              </div>
            </div>
            {!showApply && (
              <button 
                onClick={() => setShowApply(true)}
                className="bg-primary text-white font-black px-12 py-4 rounded-sm transition-all hover:bg-opacity-90 w-full md:w-auto shadow-lg shadow-primary/20"
              >
                Apply Now
              </button>
            )}
          </div>

          <div className="mt-12 space-y-8">
            <section>
              <h2 className="text-2xl font-black text-text-dark mb-4">Description</h2>
              <div className="text-text-gray leading-relaxed text-lg whitespace-pre-wrap">
                {job.description}
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-black text-text-dark mb-4">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-3 text-text-gray text-lg">
                <li>Collaborate with cross-functional teams to define and ship new features.</li>
                <li>Write clean, maintainable, and efficient code.</li>
                <li>Participate in code reviews and contribute to architectural decisions.</li>
                <li>Troubleshoot and debug production issues.</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Application Form Overlay/Section */}
        {showApply && (
          <div className="mt-12 bg-white p-8 md:p-12 border-2 border-primary shadow-2xl rounded-sm">
            <h2 className="text-3xl font-black text-text-dark mb-2">Apply for this position</h2>
            <p className="text-text-gray mb-10 text-lg">Send your resume and cover note to apply for this role.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-dark font-bold mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-4 border border-border rounded-sm outline-none focus:border-primary transition-all bg-gray-50"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-text-dark font-bold mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full p-4 border border-border rounded-sm outline-none focus:border-primary transition-all bg-gray-50"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-text-dark font-bold mb-2">Resume Link (URL)</label>
                <input 
                  type="url" 
                  required
                  className="w-full p-4 border border-border rounded-sm outline-none focus:border-primary transition-all bg-gray-50"
                  placeholder="https://example.com/your-resume"
                  value={formData.resume_link}
                  onChange={(e) => setFormData({...formData, resume_link: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-text-dark font-bold mb-2">Cover Note</label>
                <textarea 
                  required
                  rows={6}
                  className="w-full p-4 border border-border rounded-sm outline-none focus:border-primary transition-all bg-gray-50"
                  placeholder="Tell us why you're a good fit..."
                  value={formData.cover_note}
                  onChange={(e) => setFormData({...formData, cover_note: e.target.value})}
                ></textarea>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary text-white font-black py-4 rounded-sm transition-all hover:bg-opacity-90 disabled:bg-gray-400 text-lg shadow-lg shadow-primary/20"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowApply(false)}
                  className="px-8 border border-border font-bold rounded-sm hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
