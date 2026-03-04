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

- **Home Page** — Hero section, category explorer, featured jobs carousel, latest jobs grid with real-time search & filter
- **Job Listings Page (`/jobs`)** — Dedicated browse-all-jobs page with sidebar filters (Job Type, Category, Experience Level), active filter chips, and loading skeletons
- **Job Detail Page (`/jobs/:id`)** — Full job description with an inline "Apply Now" form
- **Application Form** — Collects name, email, resume URL, and cover note with full validation
- **Admin Dashboard (`/admin`)** — Post new job listings, delete existing ones, and view all submitted applications in two tabs
- **Responsive UI** — Pixel-faithful implementation of the Figma design, fully mobile-responsive
- **MongoDB Backend** — All job listings and applications are persisted in MongoDB Atlas

---

## 🗂️ Project Structure

```
QuickHire_qtec_task/
├── client/                         # Next.js frontend
│   ├── .env.local                  # ← create from .env.local.example
│   ├── .env.local.example          # Environment variable template
│   └── src/
│       ├── app/
│       │   ├── page.tsx            # Home: hero + categories + featured + latest jobs
│       │   ├── jobs/
│       │   │   ├── page.tsx        # Browse all jobs with sidebar filters  ← NEW
│       │   │   └── [id]/page.tsx   # Job detail + Apply Now form
│       │   └── admin/page.tsx      # Admin dashboard (post/delete jobs, view apps)
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── JobCard.tsx         # Reusable latest-jobs card
│       │   └── FeaturedJobCard.tsx # Reusable featured-jobs card
│       ├── lib/
│       │   └── api.ts              # Centralized typed API utility  ← NEW
│       └── types/
│           └── index.ts            # Shared TypeScript interfaces
│
└── server/                         # Node.js/Express backend
    ├── models/
    │   └── index.js                # Mongoose schemas: Job, FeaturedJob, Application
    ├── routes/
    │   └── api.js                  # All REST API routes
    ├── seed.js                     # Database seeder
    ├── server.js                   # Express app entry point
    ├── .env                        # ← create from .env.example  (not committed)
    └── .env.example                # Environment variable template
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

Create a `.env` file from the template:

```bash
cp .env.example .env
# Then edit .env and fill in your MONGODB_URI
```

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
```

Create a `.env.local` file from the template:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the dev server:

```bash
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

### Backend (`server/.env`)

| Variable | Description | Default |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/quickhire` |
| `PORT` | Server port | `5000` |

### Frontend (`client/.env.local`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| UI Design | Based on Figma: QSL QuickHire template |

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
| `/jobs` | Browse all jobs with sidebar filters (Type, Category, Experience) |
| `/jobs/:id` | Job detail page with Apply Now form |
| `/admin` | Admin dashboard — post jobs, delete jobs, view applications |
