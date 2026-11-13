import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useNewsArticle } from "../hooks/useNews";
import NewsArticleContent from "../components/NewsArticleContent";

const backLinkClass =
  "inline-flex min-h-[44px] items-center gap-2 rounded-md " +
  "text-sm font-semibold text-tech-gold hover:text-gold-glow " +
  "focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-tech-gold focus-visible:ring-offset-4 " +
  "focus-visible:ring-offset-deep-space";

function BackToNews() {
  return (
    <Link to="/news" className={backLinkClass}>
      <FaArrowLeft aria-hidden="true" />
      Back to news
    </Link>
  );
}

export default function NewsArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { article, loading, error, retry } = useNewsArticle(slug);

  useEffect(() => {
    if (loading) return;
    const previousTitle = document.title;

    document.title = article
      ? `${article.title} | GT Esports`
      : "Article not found | GT Esports";

    return () => {
      document.title = previousTitle;
    };
  }, [article, loading]);

  if (loading) {
    return (
      <div
        className="bg-deep-space px-4 pb-16 pt-8 sm:px-6 sm:pt-12"
        aria-busy="true"
      >
        <div className="mx-auto max-w-3xl">
          <BackToNews />
          <p role="status" className="sr-only">
            Loading article…
          </p>
          <div
            aria-hidden="true"
            className="mt-8 animate-pulse space-y-6 motion-reduce:animate-none"
          >
            <div className="h-4 w-32 rounded bg-white/10" />
            <div className="h-12 w-4/5 rounded bg-white/10" />
            <div className="h-4 w-48 rounded bg-white/10" />
            <div className="aspect-[16/9] rounded-2xl bg-white/[0.06]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-deep-space px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <BackToNews />

          <h1 className="mt-8 font-outfit text-4xl font-bold text-white">
            {error ? "Something went wrong" : "Article not found"}
          </h1>

          <p className="mt-4 leading-relaxed text-gray-300">
            {error ??
              "This article may have moved, or the link may be incorrect."}
          </p>

          {error && (
            <button
              type="button"
              onClick={retry}
              className="mt-6 min-h-[44px] rounded-full border border-tech-gold/50 px-6 py-2 font-medium text-tech-gold hover:bg-tech-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-gold focus-visible:ring-offset-4 focus-visible:ring-offset-deep-space"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-deep-space pb-16 pt-8 sm:pb-24 sm:pt-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 xl:px-8">
        <BackToNews />
        <NewsArticleContent article={article} />
        <footer className="mx-auto mt-12 max-w-3xl border-t border-white/10 pt-6">
          <Link to="/news" className={backLinkClass}>
            <FaArrowLeft aria-hidden="true" />
            Back to all news
          </Link>
        </footer>
      </div>
    </div>
  );
}
