import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { formatNewsDate, getNewsArticle } from "../data/newsData";

const backLinkClass =
  "inline-flex min-h-[44px] items-center gap-2 rounded-md " +
  "text-sm font-semibold text-tech-gold hover:text-gold-glow " +
  "focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-tech-gold focus-visible:ring-offset-4 " +
  "focus-visible:ring-offset-deep-space";

export default function NewsArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = getNewsArticle(slug);

  useEffect(() => {
    const previousTitle = document.title;

    document.title = article
      ? `${article.title} | GT Esports`
      : "Article not found | GT Esports";

    return () => {
      document.title = previousTitle;
    };
  }, [article]);

  if (!article) {
    return (
      <div className="bg-deep-space px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <Link to="/news" className={backLinkClass}>
            <FaArrowLeft aria-hidden="true" />
            Back to news
          </Link>

          <h1 className="mt-8 font-outfit text-4xl font-bold text-white">
            Article not found
          </h1>

          <p className="mt-4 leading-relaxed text-gray-300">
            This article may have moved, or the link may be incorrect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-deep-space pb-16 pt-8 sm:pb-24 sm:pt-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 xl:px-8">
        <Link to="/news" className={backLinkClass}>
          <FaArrowLeft aria-hidden="true" />
          Back to news
        </Link>

        <article aria-labelledby="article-title" className="mt-8">
          <header className="mx-auto max-w-3xl">
            <p className="font-outfit text-sm font-semibold uppercase tracking-widest text-tech-gold">
              GT Esports News
            </p>

            <h1
              id="article-title"
              className="mt-4 break-words font-outfit text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
            >
              {article.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400 sm:text-base">
              <p>
                By{" "}
                <span className="font-medium text-gray-200">
                  {article.author}
                </span>
              </p>

              <time dateTime={article.date}>
                {formatNewsDate(article.date)}
              </time>
            </div>

            <div
              aria-hidden="true"
              className="mt-8 h-1 w-20 bg-tech-gold"
            />
          </header>

          <figure className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:mt-10">
            <img
              src={article.image}
              alt={article.imageAlt}
              decoding="async"
              className="block h-auto w-full"
            />
          </figure>

          <div className="mx-auto mt-10 max-w-3xl space-y-10 break-words text-base leading-8 text-gray-300 sm:mt-14 sm:text-lg">
            {article.sections.map((section, sectionIndex) => (
              <section key={sectionIndex}>
                {section.heading && (
                  <h2 className="mb-4 font-outfit text-2xl font-semibold leading-tight text-white sm:text-3xl">
                    {section.heading}
                  </h2>
                )}

                <div className="space-y-6">
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
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