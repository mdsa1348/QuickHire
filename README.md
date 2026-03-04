# QuickHire — Job Board Application

A full-stack mini job board application built with **Next.js** (frontend) and **Node.js/Express** (backend), using **MongoDB Atlas** for data persistence.

> Built as part of the QSL Software Engineer assessment task.

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| Frontend | *(deploy to Vercel)* |
| Backend API | *(deploy to Railway/Render)* |

---

## 📸 Features

- **Job Listings Page** — Browse all jobs with real-time search by title/company and filter by location or category
- **Job Detail Page** — Full job description with an inline "Apply Now" form
- **Application Form** — Collects name, email, resume URL, and cover note with full validation
- **Admin Dashboard** — Post new job listings, delete existing ones, and view all submitted applications
- **Responsive UI** — Pixel-faithful implementation of the Figma design, fully mobile-responsive
- **MongoDB Backend** — All job listings and applications are persisted in MongoDB Atlas

---

## 🗂️ Project Structure

```
QuickHire_qtec_task/
├── client/                     # Next.js frontend
│   └── src/
│       ├── app/
│       │   ├── page.tsx         # Home: job listings + search + categories
│       │   ├── jobs/[id]/       # Job detail + Apply Now form
│       │   └── admin/           # Admin dashboard
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── JobCard.tsx      # Latest Jobs card
│       │   └── FeaturedJobCard.tsx
│       └── types/
│           └── index.ts         # Shared TypeScript interfaces
│
└── server/                     # Node.js/Express backend
    ├── models/
    │   └── index.js             # Mongoose schemas: Job, FeaturedJob, Application
    ├── routes/
    │   └── api.js               # All REST API routes
    ├── seed.js                  # Database seeder
    ├── server.js                # Express app entry point
    └── .env                     # Environment variables (not committed)
```

---

## ⚙️ Getting Started (Local Development)

### Prerequisites

- Node.js v18+
- npm
- A MongoDB Atlas cluster (or local MongoDB)

---

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/QuickHire_qtec_task.git
cd QuickHire_qtec_task
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/quickhire?appName=Cluster0
PORT=5000
```

Seed the database with sample data:

```bash
node seed.js
```

Start the backend server:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will be running at `http://localhost:3000`

---

## 🌐 API Endpoints

### Jobs

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs` | List all jobs (sorted newest first) |
| `GET` | `/api/jobs/:id` | Get single job details |
| `POST` | `/api/jobs` | Create a new job listing (Admin) |
| `DELETE` | `/api/jobs/:id` | Delete a job listing (Admin) |

### Featured Jobs

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/featured-jobs` | List all featured jobs |

### Applications

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/applications` | Submit a job application |
| `GET` | `/api/applications` | List all applications (Admin) |
| `GET` | `/api/applications?job_id=:id` | Filter applications by job |

---

## 🗄️ Database Models

### Job
```
{
  title:       String  (required)
  company:     String  (required)
  location:    String  (required)
  category:    String  (required)
  description: String  (required)
  createdAt:   Date    (auto)
}
```

### Application
```
{
  job_id:      ObjectId → Job  (required)
  name:        String          (required)
  email:       String          (required, validated)
  resume_link: String          (required, valid URL)
  cover_note:  String          (required)
  createdAt:   Date            (auto)
}
```

### FeaturedJob
```
{
  title:       String    (required)
  company:     String    (required)
  location:    String    (required)
  description: String    (required)
  categories:  [String]  (required)
  logo:        String    (required)
  createdAt:   Date      (auto)
}
```

---

## ✅ Validation Rules

All API endpoints validate:
- **Required fields** — 400 error with descriptive message if missing
- **Email format** — must match standard email pattern
- **Resume link** — must be a valid URL (validated with `new URL()`)

---

## 🔑 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `PORT` | Server port (default: 5000) | `5000` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| UI Design | Figma (QSL QuickHire template) |

---

## 📋 Seeding the Database

The `seed.js` script populates the database with the exact data shown in the Figma design:

- **8 Latest Jobs** (Social Media Assistant, Brand Designer, Interactive Developer, HR Manager)
- **8 Featured Jobs** (Revolut, Dropbox, Pitch, Blinklist, ClassPass, Canva, GoDaddy, Twitter)

```bash
cd server
node seed.js
```

> ⚠️ This will **delete and re-insert** all jobs and featured jobs. Applications are preserved.

---

## 📁 Pages Overview

| Route | Description |
|---|---|
| `/` | Home page — Hero, Categories, Featured Jobs, Latest Jobs, Footer |
| `/jobs/:id` | Job detail page with Apply Now form |
| `/admin` | Admin dashboard — post jobs, delete jobs, view applications |
