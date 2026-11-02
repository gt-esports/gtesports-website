import communityImage from "../assets/about-image/gt player.jpg";

export interface NewsArticle {
  slug: string;
  title: string;
  date: string;
  author: string;
  image: string;
  imageAlt: string;
  sections: {
    heading?: string;
    paragraphs: string[];
  }[];
}

export const newsArticles: NewsArticle[] = [
  {
    slug: "welcome-to-gt-esports-news",
    title: "Welcome to GT Esports News",
    date: "2026-10-21",
    author: "GT Esports",
    image: communityImage,
    imageAlt: "GT Player competing at Gamefest",
    sections: [
      {
        paragraphs: [
          "This is a sample article for previewing the GT Esports news page.",
        ],
      },
      {
        heading: "Example Section",
        paragraphs: [
          "Another example section.",
          "Coming Soon!",
        ],
      },
    ],
  },
];

export function getNewsArticle(slug: string | undefined) {
  return newsArticles.find((article) => article.slug === slug);
}

export function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}