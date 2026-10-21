import { NewsArticle } from "../data/newsSchema";
import { supabase } from "./supabase";

function requestError(error: {code?: string; message: string}, fallback: string): Error {
    const errorMessage = error.message || fallback;
    const errorCode = error.code ? ` (Code: ${error.code})` : "";
    
    return new Error(`${errorMessage}${errorCode}`);
}

export async function fetchNewsArticles(): Promise<NewsArticle[]> {
    const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .order('published_at', {ascending: false});
    
    if (error) {
        throw requestError(error, "Failed to fetch news articles.");
    }

    return data ?? []
}