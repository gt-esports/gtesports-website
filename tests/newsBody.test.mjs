import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/newsBody.ts", import.meta.url),
  "utf8"
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
});
const displaySource = (
  await readFile(new URL("../src/lib/newsDisplay.ts", import.meta.url), "utf8")
)
  .replace('import type { Category } from "../data/newsSchema";', "")
  .replace(
    "export const newsCategories: Category[]",
    "export const newsCategories: string[]"
  );
const { outputText: displayOutput } = ts.transpileModule(displaySource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
});
const code = outputText.replace(
  'import { parseArticleBody } from "./newsDisplay";',
  `const { parseArticleBody } = await import("data:text/javascript;base64,${Buffer.from(
    displayOutput
  ).toString("base64")}");`
);
const moduleUrl = `data:text/javascript;base64,${Buffer.from(code).toString(
  "base64"
)}`;
const {
  toNewsBodyDocument,
  serializeNewsBody,
  hasNewsBodyContent,
  NEWS_BODY_PREFIX,
} = await import(moduleUrl);
const toDoc = (body) => toNewsBodyDocument(body);
test("legacy paragraphs and section headings convert and roundtrip safely", () => {
  const source = "Intro.\n\n## Results\nWe won.\n\nNext.";
  const parsed = toDoc(source);
  assert.deepEqual(
    parsed.content.map((n) => n.type),
    ["paragraph", "heading", "paragraph", "paragraph"]
  );
  assert.equal(hasNewsBodyContent(source), true);
});
test("rich text serializes allowed marks and formatting, with safe allowlists", () => {
  const document = {
    type: "doc",
    attrs: { attack: "ignored" },
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Styled",
            marks: [
              { type: "bold" },
              {
                type: "textStyle",
                attrs: {
                  color: "#B3A369",
                  fontSize: "22px",
                  fontFamily: "evil",
                },
              },
              { type: "link", attrs: { href: "javascript:alert(1)" } },
            ],
          },
        ],
      },
    ],
  };
  const saved = serializeNewsBody(document);
  assert.ok(saved.startsWith(NEWS_BODY_PREFIX));
  const restored = toDoc(saved);
  assert.deepEqual(restored.content[0].content[0].marks, [
    { type: "bold" },
    { type: "textStyle", attrs: { color: "#b3a369", fontSize: "22px" } },
  ]);
});
test("unsafe nodes and invalid rich payloads fall back to legacy-safe text", () => {
  const body =
    NEWS_BODY_PREFIX +
    JSON.stringify({
      type: "doc",
      content: [
        { type: "image", attrs: { src: "javascript:alert(1)" } },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Safe",
              marks: [
                {
                  type: "textStyle",
                  attrs: { color: "red", fontSize: "999px" },
                },
              ],
            },
          ],
        },
      ],
    });
  const document = toDoc(body);
  assert.equal(document.content.length, 1);
  assert.deepEqual(document.content[0].content[0].marks, undefined);
  assert.equal(hasNewsBodyContent(NEWS_BODY_PREFIX + "{invalid"), true);
});
test("empty editor content never saves formatting-only documents", () => {
  assert.equal(
    serializeNewsBody({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "  ", marks: [{ type: "bold" }] }],
        },
      ],
    }),
    ""
  );
  assert.equal(hasNewsBodyContent(" \n"), false);
  assert.deepEqual(toDoc("").content, [{ type: "paragraph", content: [] }]);
  assert.deepEqual(
    toDoc(NEWS_BODY_PREFIX + JSON.stringify({ type: "doc", content: [] }))
      .content,
    [{ type: "paragraph", content: [] }]
  );
});
test("preserves intentional blank paragraphs alongside visible content", () => {
  const saved = serializeNewsBody({
    type: "doc",
    content: [
      { type: "paragraph", content: [{ type: "text", text: "First" }] },
      { type: "paragraph", content: [] },
      { type: "paragraph", content: [{ type: "text", text: "Third" }] },
    ],
  });
  assert.equal(toDoc(saved).content.length, 3);
});

test("round-trips typed pixel sizes and rejects invalid or out-of-range values", () => {
  const sizes = ["8px", "27px", "96px", "7px", "97px", "28.5px", "2rem"];
  const saved = serializeNewsBody({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: sizes.map((fontSize) => ({
          type: "text",
          text: fontSize,
          marks: [{ type: "textStyle", attrs: { fontSize } }],
        })),
      },
    ],
  });
  assert.deepEqual(
    toDoc(saved).content[0].content.map(
      (node) => node.marks?.[0]?.attrs?.fontSize
    ),
    ["8px", "27px", "96px", undefined, undefined, undefined, undefined]
  );
});
