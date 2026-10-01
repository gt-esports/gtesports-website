import type { NewsPost } from "../data/newsData";

interface NewsCardProps {
  post: NewsPost;
  featured?: boolean;
}

const publicationDate = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function NewsCard({ post, featured = false }: NewsCardProps) {
  return (
    <article
      aria-labelledby={`${post.id}-title`}
      className={`overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] ${
        featured ? "grid md:grid-cols-2" : "flex h-full flex-col"
      }`}
    >
      <div
        className={`aspect-[16/10] overflow-hidden bg-black/30 ${
          featured ? "md:aspect-auto md:min-h-[360px]" : ""
        }`}
      >
        <img
          src={post.image}
          alt={post.imageAlt}
          loading={featured ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      <div
        className={`flex flex-col items-start ${
          featured ? "justify-center p-6 sm:p-8 lg:p-12" : "flex-1 p-6 sm:p-8"
        }`}
      >
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="font-medium text-tech-gold">{post.category}</span>
          <time dateTime={post.publishedAt} className="text-gray-400">
            {publicationDate.format(new Date(`${post.publishedAt}T00:00:00Z`))}
          </time>
        </div>
        <h2
          id={`${post.id}-title`}
          className={`font-outfit font-bold leading-tight text-white ${
            featured ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl"
          }`}
        >
          {post.title}
        </h2>
        <p className="mt-4 max-w-prose leading-relaxed text-gray-300">
          {post.preview}
        </p>
      </div>
    </article>
  );
}

export default NewsCard;
