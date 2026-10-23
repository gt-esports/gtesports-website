export type NewsArticle = DraftedArticle | PublishedArticle;

interface Article {
    id: string;
    title: string;
    slug: string;
    category: Category;
    cover_url: string;
    cover_alt?: string;
    featured: boolean;
    revision?: number;
    created_at: string;
    updated_at: string;
}

export interface DraftedArticle extends Article {
    status: 'draft';
    excerpt?: string;
    body?: string;
    author?: string;
    published_at?: string | null;
} // These fields are optional for an article draft, but not in published ones

export interface PublishedArticle extends Article {
    status: 'published';
    excerpt: string;
    body: string;
    author: string;
    published_at: string;
}

export type Status = 'draft' | 'published'
export type Category = 'Community' | 'Competition' | 'Events' | 'Announcements'