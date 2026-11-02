import { Link } from "react-router-dom";
import type { PublishedArticle } from "../data/newsSchema";
import { formatNewsDate } from "../lib/newsDisplay";
import fallbackCover from "../assets/branding/gt-esports-image.webp";

interface NewsCardProps {
  article: PublishedArticle;
  featured?: boolean;
}

function NewsCard({ article, featured = false }: NewsCardProps) {
  const titleId = `news-${article.id}-title`;
  const hasCover = Boolean(article.cover_url);

  return (
    <article
      aria-labelledby={titleId}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors duration-200 hover:border-tech-gold/50 motion-reduce:transition-none ${
        featured ? "grid md:grid-cols-2" : "flex h-full flex-col"
      }`}
    >
      <div
        className={`aspect-[16/10] overflow-hidden bg-black/30 ${
          featured ? "md:aspect-auto md:min-h-[360px]" : ""
        }`}
      >
        <img
          src={hasCover ? article.cover_url : fallbackCover}
          alt={hasCover ? article.cover_alt ?? "" : ""}
          loading={featured ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>

      <div
        className={`flex flex-col items-start ${
          featured ? "justify-center p-6 sm:p-8 lg:p-12" : "flex-1 p-6 sm:p-8"
        }`}
      >
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {article.featured && (
            <span className="rounded-full bg-tech-gold px-3 py-1 text-xs font-bold uppercase tracking-wider text-deep-space">
              Featured
            </span>
          )}
          <span className="font-medium text-tech-gold">{article.category}</span>
          <time dateTime={article.published_at} className="text-gray-400">
            {formatNewsDate(article.published_at)}
          </time>
        </div>
        <h2
          id={titleId}
          className={`font-outfit font-bold leading-tight text-white ${
            featured ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl"
          }`}
        >
          {/* The link's ::after covers the whole card, so the card is clickable but screen readers hear one link. */}
          <Link
            to={`/news/${article.slug}`}
            className="rounded-sm after:absolute after:inset-0 after:content-[''] group-hover:text-tech-gold focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-tech-gold"
          >
            {article.title}
          </Link>
        </h2>
        <p className="mt-4 max-w-prose leading-relaxed text-gray-300">
          {article.excerpt}
        </p>
        <p className="mt-auto pt-6 text-sm text-gray-400">By {article.author}</p>
      </div>
    </article>
  );
}

export default NewsCard;