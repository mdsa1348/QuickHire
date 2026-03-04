// Centralized API utility – reads base URL from env (falls back to localhost)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ── Types ────────────────────────────────────────────────────────────────────

export interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    category: string;
    description: string;
    createdAt: string;
}

export interface FeaturedJob {
    _id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    categories: string[];
    logo: string;
    createdAt: string;
}

export interface Application {
    _id: string;
    job_id: string | { _id: string; title: string; company: string; location: string } | null;
    name: string;
    email: string;
    resume_link: string;
    cover_note: string;
    createdAt: string;
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    ok: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        });
        const data = await res.json();
        if (!res.ok) {
            return { ok: false, error: data.message || 'Something went wrong' };
        }
        return { ok: true, data };
    } catch {
        return { ok: false, error: 'Failed to connect to the server' };
    }
}

// ── Jobs API ──────────────────────────────────────────────────────────────────

export const jobsApi = {
    /** GET /api/jobs – fetch all jobs */
    getAll: () => apiFetch<Job[]>('/api/jobs'),

    /** GET /api/jobs/:id – fetch a single job */
    getById: (id: string) => apiFetch<Job>(`/api/jobs/${id}`),

    /** POST /api/jobs – create a job (Admin) */
    create: (payload: Omit<Job, '_id' | 'createdAt'>) =>
        apiFetch<Job>('/api/jobs', { method: 'POST', body: JSON.stringify(payload) }),

    /** DELETE /api/jobs/:id – delete a job (Admin) */
    remove: (id: string) => apiFetch<{ message: string }>(`/api/jobs/${id}`, { method: 'DELETE' }),
};

// ── Featured Jobs API ─────────────────────────────────────────────────────────

export const featuredJobsApi = {
    /** GET /api/featured-jobs – fetch all featured jobs */
    getAll: () => apiFetch<FeaturedJob[]>('/api/featured-jobs'),
};

// ── Applications API ──────────────────────────────────────────────────────────

export interface ApplicationPayload {
    job_id: string;
    name: string;
    email: string;
    resume_link: string;
    cover_note: string;
}

export const applicationsApi = {
    /** POST /api/applications – submit an application */
    submit: (payload: ApplicationPayload) =>
        apiFetch<Application>('/api/applications', { method: 'POST', body: JSON.stringify(payload) }),

    /** GET /api/applications – list all applications (Admin) */
    getAll: (jobId?: string) => {
        const qs = jobId ? `?job_id=${jobId}` : '';
        return apiFetch<Application[]>(`/api/applications${qs}`);
    },
};
