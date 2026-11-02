import { useCallback, useEffect, useState } from "react";
import type { Category, NewsArticle, PublishedArticle } from "../data/newsSchema";
import { fetchArticleBySlug, fetchNewsByCategory, fetchNewsByPage } from "../lib/news";

export const NEWS_PAGE_SIZE = 9;

const isPublished = (article: NewsArticle): article is PublishedArticle => article.status === "published";

export function useNewsList(category: Category | "All") {
  const [articles, setArticles] = useState<PublishedArticle[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    setArticles([]);
    setPage(1);
    setHasMore(false);

    const request = category === "All" ? fetchNewsByPage(1, NEWS_PAGE_SIZE) : fetchNewsByCategory(category);
    request
      .then((rows) => {
        if (ignore) return;
        setArticles(rows.filter(isPublished));
        setHasMore(category === "All" && rows.length === NEWS_PAGE_SIZE);
      })
      .catch(() => { if (!ignore) setError("We couldn't load news right now."); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, [category, attempt]);

  const loadMore = useCallback(async () => {
    if (category !== "All" || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const rows = await fetchNewsByPage(next, NEWS_PAGE_SIZE);
      setArticles((current) => {
        const seen = new Set(current.map((article) => article.id));
        return [...current, ...rows.filter(isPublished).filter((article) => !seen.has(article.id))];
      });
      setPage(next);
      setHasMore(rows.length === NEWS_PAGE_SIZE);
    } catch {
      setError("We couldn't load more news. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  }, [category, hasMore, loadingMore, page]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return { articles, loading, loadingMore, error, hasMore, loadMore, retry };
}

export function useNewsArticle(slug: string | undefined) {
  const [article, setArticle] = useState<PublishedArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    if (!slug) {
      setArticle(null);
      setLoading(false);
      return;
    }

    fetchArticleBySlug(slug)
      .then((row) => { if (!ignore) setArticle(row && isPublished(row) ? row : null); })
      .catch(() => { if (!ignore) setError("We couldn't load this article right now."); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, [slug, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return { article, loading, error, retry };
}