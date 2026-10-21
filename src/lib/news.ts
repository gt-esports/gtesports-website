import { NewsArticle } from "../data/newsSchema";
import { supabase } from "./supabase";

function requestError(error: {code?: string; message: string}, fallback: string): Error {
    const errorMessage = error.message || fallback;
    const errorCode = error.code ? ` (Code: ${error.code})` : "";
    
    return new Error(`${errorMessage}${errorCode}`);
}

export async function fetchAllNewsArticles(): Promise<NewsArticle[]> {
    const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .order('published_at', { ascending: false });

    if (error) {
        throw requestError(error, "Failed to fetch news articles.");
    }

    return data ?? []
}

export async function fetchLimitedNews(limit: number): Promise<NewsArticle[]> {
    const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(limit);

    if (error) {
        throw requestError(error, `Failed to fetch ${limit} news articles.`);
    }

    return data ?? [];
}

export async function fetchNewsByPage(page: number, pageSize: number): Promise<NewsArticle[]> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .order('published_at', { ascending: false })
        .range(from, to);

    if (error) {
        throw requestError(error, `Failed to fetch page ${page} of news articles.`);
    }

    return data ?? [];
}

export async function fetchNewsByCategory(category: string, limit?: number): Promise<NewsArticle[]> {
    let query = supabase
        .from('news_posts')
        .select('*')
        .eq('category', category)
        .order('published_at', { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
        throw requestError(error, `Failed to fetch news for category "${category}".`);
    }

    return data ?? [];
}

export async function fetchNewsByAuthor(author: string, limit?: number): Promise<NewsArticle[]> {
    let query = supabase
        .from('news_posts')
        .select('*')
        .eq('author', author)
        .order('published_at', { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
        throw requestError(error, `Failed to fetch news for author "${author}".`);
    }

    return data ?? [];
}

export async function searchNewsByTitle(term: string, limit?: number): Promise<NewsArticle[]> {
    let query = supabase
        .from('news_posts')
        .select('*')
        .ilike('title', `%${term}%`)
        .order('published_at', { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
        throw requestError(error, `Failed to search news articles with title containing "${term}".`);
    }

    return data ?? [];
}

export async function fetchArticleById(id: number): Promise<NewsArticle | null> {
    const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if ((error as any).code === 'PGRST116') return null; // not found
        throw requestError(error, `Failed to fetch article with id ${id}.`);
    }

    return data ?? null;
}

export async function fetchArticleBySlug(slug: string): Promise<NewsArticle | null> {
    const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        if ((error as any).code === 'PGRST116') return null;
        throw requestError(error, `Failed to fetch article with slug "${slug}".`);
    }

    return data ?? null;
}