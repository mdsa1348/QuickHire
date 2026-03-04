const express = require('express');
const router = express.Router();
const { Job, FeaturedJob, Application } = require('../models');

// ── Jobs (Latest Jobs section) ────────────────────────────────────────────

// GET /api/jobs – List all jobs
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/:id – Get single job details
router.get('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/jobs – Create a job (Admin)
router.post('/jobs', async (req, res) => {
  const { title, company, location, category, description } = req.body;
  if (!title || !company || !location || !category || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const job = new Job({ title, company, location, category, description });
  try {
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/jobs/:id – Delete a job (Admin)
router.delete('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Featured Jobs ─────────────────────────────────────────────────────────

// GET /api/featured-jobs – List all featured jobs
router.get('/featured-jobs', async (req, res) => {
  try {
    const featuredJobs = await FeaturedJob.find().sort({ createdAt: -1 });
    res.json(featuredJobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Applications ──────────────────────────────────────────────────────────

// GET /api/applications – List all applications (Admin), optional ?job_id= filter
router.get('/applications', async (req, res) => {
  try {
    const filter = req.query.job_id ? { job_id: req.query.job_id } : {};
    const applications = await Application.find(filter)
      .populate('job_id', 'title company location')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/applications – Submit job application
router.post('/applications', async (req, res) => {
  const { job_id, name, email, resume_link, cover_note } = req.body;

  if (!job_id || !name || !email || !resume_link || !cover_note) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    new URL(resume_link);
  } catch (_) {
    return res.status(400).json({ message: 'Invalid resume link URL' });
  }

  const application = new Application({ job_id, name, email, resume_link, cover_note });
  try {
    const newApp = await application.save();
    res.status(201).json(newApp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
