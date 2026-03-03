# QuickHire - Job Board Application

QuickHire is a mini job board application built with Next.js and Node.js/Express.

## Features
- **Job Listings**: Browse all available jobs with search and filter capabilities.
- **Job Details**: View detailed information about a specific job.
- **Job Application**: Submit applications with name, email, resume link, and cover note.
- **Admin Panel**: Manage jobs (Create and Delete).
- **Responsive Design**: Optimized for desktop and mobile devices.

## Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, TypeScript.
- **Backend**: Node.js, Express, MongoDB, Mongoose.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed or a remote MongoDB URI

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your MongoDB URI:
   ```
   MONGODB_URI=your_mongodb_uri
   PORT=5000
   ```
4. Seed the database with sample data (optional):
   ```bash
   node seed.js
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `GET /api/jobs`: List all jobs
- `GET /api/jobs/:id`: Get job details
- `POST /api/jobs`: Create a new job (Admin)
- `DELETE /api/jobs/:id`: Delete a job (Admin)
- `POST /api/applications`: Submit a job application
