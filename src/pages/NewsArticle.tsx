import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useNewsArticle } from "../hooks/useNews";
import { formatNewsDate, parseArticleBody } from "../lib/newsDisplay";

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
      <div className="bg-deep-space px-4 pb-16 pt-8 sm:px-6 sm:pt-12" aria-busy="true">
        <div className="mx-auto max-w-3xl">
          <BackToNews />
          <p role="status" className="sr-only">Loading article…</p>
          <div aria-hidden="true" className="mt-8 animate-pulse space-y-6 motion-reduce:animate-none">
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
            {error ?? "This article may have moved, or the link may be incorrect."}
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

  const sections = parseArticleBody(article.body);

  return (
    <div className="bg-deep-space pb-16 pt-8 sm:pb-24 sm:pt-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 xl:px-8">
        <BackToNews />

        <article aria-labelledby="article-title" className="mt-8">
          <header className="mx-auto max-w-3xl">
            <p className="font-outfit text-sm font-semibold uppercase tracking-widest text-tech-gold">
              {article.category}
            </p>

            <h1
              id="article-title"
              className="mt-4 break-words font-outfit text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
            >
              {article.title}
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-300 sm:text-xl">
              {article.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400 sm:text-base">
              <p>
                By{" "}
                <span className="font-medium text-gray-200">
                  {article.author}
                </span>
              </p>

              <time dateTime={article.published_at}>
                {formatNewsDate(article.published_at)}
              </time>
            </div>

            <div
              aria-hidden="true"
              className="mt-8 h-1 w-20 bg-tech-gold"
            />
          </header>

          {article.cover_url && (
            <figure className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:mt-10">
              <img
                src={article.cover_url}
                alt={article.cover_alt ?? ""}
                decoding="async"
                className="block h-auto w-full"
              />
            </figure>
          )}

          <div className="mx-auto mt-10 max-w-3xl space-y-10 break-words text-base leading-8 text-gray-300 sm:mt-14 sm:text-lg">
            {sections.map((section, sectionIndex) => (
              <section key={sectionIndex}>
                {section.heading && (
                  <h2 className="mb-4 font-outfit text-2xl font-semibold leading-tight text-white sm:text-3xl">
                    {section.heading}
                  </h2>
                )}

                <div className="space-y-6">
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex} className="whitespace-pre-line">{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <footer className="mx-auto mt-12 max-w-3xl border-t border-white/10 pt-6">
            <Link to="/news" className={backLinkClass}>
              <FaArrowLeft aria-hidden="true" />
              Back to all news
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
}