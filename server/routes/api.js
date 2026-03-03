const express = require('express');
const router = express.Router();
const { Job, Application } = require('../models');

// GET /api/jobs – List all jobs
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/{id} – Get single job details
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

// DELETE /api/jobs/{id} – Delete a job (Admin)
router.delete('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/applications – Submit job application
router.post('/applications', async (req, res) => {
  const { job_id, name, email, resume_link, cover_note } = req.body;
  
  // Basic validation
  if (!job_id || !name || !email || !resume_link || !cover_note) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const url = new URL(resume_link);
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
