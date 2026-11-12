import { parseArticleBody } from "./newsDisplay";

export const NEWS_BODY_PREFIX = "GTNEWS-RICH-1:";
export const MIN_NEWS_TEXT_SIZE = 8;
export const MAX_NEWS_TEXT_SIZE = 96;
export const NEWS_TEXT_COLORS = [
  { label: "White", value: "#f8fafc" },
  { label: "Tech gold", value: "#b3a369" },
  { label: "Sky blue", value: "#93c5fd" },
  { label: "Mint", value: "#86efac" },
  { label: "Rose", value: "#fda4af" },
  { label: "Lavender", value: "#c4b5fd" },
] as const;

export type NewsMark = {
  type: "bold" | "italic" | "underline" | "textStyle";
  attrs?: { color?: string; fontSize?: string };
};
export type NewsNode = {
  type: "doc" | "paragraph" | "heading" | "text" | "hardBreak";
  attrs?: { level?: 2 };
  content?: NewsNode[];
  text?: string;
  marks?: NewsMark[];
};
export type NewsDocument = NewsNode;

const colors = new Set<string>(NEWS_TEXT_COLORS.map(({ value }) => value));
const markTypes = new Set(["bold", "italic", "underline", "textStyle"]);

function isNewsTextSize(value: unknown): value is string {
  if (typeof value !== "string" || !/^[1-9]\d{0,2}px$/.test(value))
    return false;
  const size = Number(value.slice(0, -2));
  return size >= MIN_NEWS_TEXT_SIZE && size <= MAX_NEWS_TEXT_SIZE;
}

type UnknownRecord = Record<string, unknown>;
const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function cleanInline(value: unknown): NewsNode | null {
  if (
    !isRecord(value) ||
    typeof value.type !== "string" ||
    !["text", "hardBreak"].includes(value.type)
  )
    return null;
  if (value.type === "text") {
    if (typeof value.text !== "string") return null;
    const marks = Array.isArray(value.marks)
      ? value.marks.flatMap((mark): NewsMark[] => {
          if (
            !isRecord(mark) ||
            typeof mark.type !== "string" ||
            !markTypes.has(mark.type)
          )
            return [];
          if (mark.type !== "textStyle")
            return [{ type: mark.type as NewsMark["type"] }];
          if (!isRecord(mark.attrs)) return [];
          const attrs: { color?: string; fontSize?: string } = {};
          if (
            typeof mark.attrs.color === "string" &&
            colors.has(mark.attrs.color.toLowerCase())
          )
            attrs.color = mark.attrs.color.toLowerCase();
          if (isNewsTextSize(mark.attrs.fontSize))
            attrs.fontSize = mark.attrs.fontSize;
          return Object.keys(attrs).length
            ? [{ type: "textStyle", attrs }]
            : [];
        })
      : undefined;
    return {
      type: "text",
      text: value.text,
      ...(marks?.length ? { marks } : {}),
    };
  }
  return { type: "hardBreak" };
}

function cleanDocument(value: unknown): NewsDocument | null {
  if (!isRecord(value) || value.type !== "doc" || !Array.isArray(value.content))
    return null;
  const content: NewsNode[] = [];
  for (const block of value.content) {
    if (
      !isRecord(block) ||
      !["paragraph", "heading"].includes(String(block.type)) ||
      !Array.isArray(block.content)
    )
      continue;
    const children = block.content.flatMap((child) => {
      const node = cleanInline(child);
      return node ? [node] : [];
    });
    const type = block.type as "paragraph" | "heading";
    content.push({
      type,
      ...(type === "heading" ? { attrs: { level: 2 as const } } : {}),
      content: children,
    });
  }
  if (!content.length) content.push({ type: "paragraph", content: [] });
  return { type: "doc", content };
}

function hasText(node: NewsNode): boolean {
  return node.type === "text"
    ? Boolean(node.text?.trim())
    : Boolean(node.content?.some(hasText));
}

export function serializeNewsBody(value: unknown): string {
  const clean = cleanDocument(value);
  if (!clean || clean.type !== "doc") return "";
  if (!clean.content?.some(hasText)) return "";
  const content = clean.content.map((block) => ({
    ...block,
    content: (block.content ?? []).filter(
      (node) => node.type !== "text" || node.text !== ""
    ),
  }));
  return NEWS_BODY_PREFIX + JSON.stringify({ type: "doc", content });
}

export function hasNewsBodyContent(body: string): boolean {
  return serializeNewsBody(toNewsBodyDocument(body)) !== "";
}

export function toNewsBodyDocument(body: string): NewsDocument {
  if (body.startsWith(NEWS_BODY_PREFIX)) {
    try {
      const clean = cleanDocument(
        JSON.parse(body.slice(NEWS_BODY_PREFIX.length))
      );
      if (clean) return clean;
    } catch {
      /* Malformed rich bodies fall through as readable legacy text. */
    }
  }
  const sections = parseArticleBody(body);
  const content: NewsNode[] = [];
  for (const section of sections) {
    if (section.heading)
      content.push({
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: section.heading }],
      });
    for (const paragraph of section.paragraphs) {
      const parts = paragraph.split("\n");
      const children: NewsNode[] = [];
      parts.forEach((part, index) => {
        if (index) children.push({ type: "hardBreak" });
        if (part) children.push({ type: "text", text: part });
      });
      content.push({ type: "paragraph", content: children });
    }
  }
  if (!content.length) content.push({ type: "paragraph", content: [] });
  return { type: "doc", content };
}
