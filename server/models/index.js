const mongoose = require('mongoose');

// ── Job (Latest Jobs section) ──────────────────────────────────────────────
const jobSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  location:    { type: String, required: true },
  category:    { type: String, required: true },
  description: { type: String, required: true },
  createdAt:   { type: Date, default: Date.now },
});

const Job = mongoose.model('Job', jobSchema);

// ── FeaturedJob (Featured Jobs section) ───────────────────────────────────
const featuredJobSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  location:    { type: String, required: true },
  description: { type: String, required: true },
  categories:  { type: [String], required: true },   // e.g. ['Marketing', 'Design']
  logo:        { type: String, required: true },      // short display letter(s)
  createdAt:   { type: Date, default: Date.now },
});

const FeaturedJob = mongoose.model('FeaturedJob', featuredJobSchema);

// ── Application ────────────────────────────────────────────────────────────
const applicationSchema = new mongoose.Schema({
  job_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  resume_link: { type: String, required: true },
  cover_note:  { type: String, required: true },
  createdAt:   { type: Date, default: Date.now },
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = { Job, FeaturedJob, Application };
