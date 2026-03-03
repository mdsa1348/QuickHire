export interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    category: string;
    description: string;
    createdAt: string;
}

export interface Application {
    _id: string;
    job_id: string;
    name: string;
    email: string;
    resume_link: string;
    cover_note: string;
    createdAt: string;
}

export interface JobFormData {
    title: string;
    company: string;
    location: string;
    category: string;
    description: string;
}

export interface ApplicationFormData {
    name: string;
    email: string;
    resume_link: string;
    cover_note: string;
}
