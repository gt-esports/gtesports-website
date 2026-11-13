import type { CSSProperties, ReactNode } from "react";
import {
  toNewsBodyDocument,
  type NewsMark,
  type NewsNode,
} from "../lib/newsBody";

type RichStyle = CSSProperties & { "--news-text-color"?: string };

function renderText(node: NewsNode, key: string): ReactNode {
  if (node.type === "hardBreak") return <br key={key} />;
  if (node.type !== "text") return null;
  let content: ReactNode = node.text ?? "";
  for (const [index, mark] of (node.marks ?? []).entries()) {
    content = wrapMark(content, mark, `${key}-${index}`);
  }
  return <span key={key}>{content}</span>;
}

function wrapMark(content: ReactNode, mark: NewsMark, key: string): ReactNode {
  if (mark.type === "bold") return <strong key={key}>{content}</strong>;
  if (mark.type === "italic") return <em key={key}>{content}</em>;
  if (mark.type === "underline") return <u key={key}>{content}</u>;
  const style: RichStyle = {};
  if (mark.attrs?.color) style.color = mark.attrs.color;
  if (mark.attrs?.fontSize) style.fontSize = mark.attrs.fontSize;
  return (
    <span key={key} style={style}>
      {content}
    </span>
  );
}

function renderBlock(node: NewsNode, key: string, preview: boolean): ReactNode {
  const children = (node.content ?? []).map((child, index) =>
    renderText(child, `${key}-${index}`)
  );
  if (node.type === "heading") {
    const Heading = preview ? "h4" : "h2";
    return (
      <Heading
        key={key}
        className="mb-4 font-outfit text-2xl font-semibold leading-tight text-white sm:text-3xl"
      >
        {children}
      </Heading>
    );
  }
  if (node.type === "paragraph")
    return (
      <p key={key} className="whitespace-pre-wrap">
        {children}
      </p>
    );
  return null;
}

export default function NewsArticleBody({
  body,
  preview = false,
}: {
  body: string;
  preview?: boolean;
}) {
  const document = toNewsBodyDocument(body);
  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-10 break-words text-base leading-[1.65] text-gray-300 sm:mt-14 sm:text-lg">
      {(document.content ?? []).map((node, index) =>
        renderBlock(node, `block-${index}`, preview)
      )}
    </div>
  );
}
