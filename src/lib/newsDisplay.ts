import type { Category } from "../data/newsSchema";

export const newsCategories: Category[] = ["Community", "Competition", "Events", "Announcements"];

export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
}

/**
 * Article bodies are plain text typed into Supabase. These are basic rules:
 * - a blank line starts a new paragraph
 * - a line starting with "## " starts a new section with that heading
 * - single line breaks inside a paragraph are kept (render with whitespace-pre-line)
 */
export function parseArticleBody(body: string): ArticleSection[] {
  const sections: ArticleSection[] = [];
  let current: ArticleSection = { paragraphs: [] };
  let paragraph: string[] = [];

  const endParagraph = () => {
    const text = paragraph.join("\n").trim();
    if (text) current.paragraphs.push(text);
    paragraph = [];
  };

  for (const line of body.replace(/\r\n?/g, "\n").split("\n")) {
    const heading = /^##\s+(.+)$/.exec(line.trim());
    if (heading) {
      endParagraph();
      if (current.heading || current.paragraphs.length) sections.push(current);
      current = { heading: heading[1].trim(), paragraphs: [] };
    } else if (line.trim() === "") {
      endParagraph();
    } else {
      paragraph.push(line.trimEnd());
    }
  }
  endParagraph();
  if (current.heading || current.paragraphs.length) sections.push(current);
  return sections;
}

const newsDate = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "America/New_York",
});

/** Formats a published_at timestamp, e.g. "October 21, 2026". */
export function formatNewsDate(timestamp: string): string {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? "" : newsDate.format(date);
}