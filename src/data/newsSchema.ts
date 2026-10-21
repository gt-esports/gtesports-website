export interface NewsArticle {
    id: number,
    title: string,
    slug: string,
    excerpt: string,
    body: string,
    author: string,
    category: string,
    cover_url: string,
    cover_alt?: string,
    featured: boolean,
    status: Status,
    revision?: number,
    created_at: string,
    updated_at: string,
    published_at: string
}

export type Status = 'Draft' | 'Review' | 'Published' | 'Archived'