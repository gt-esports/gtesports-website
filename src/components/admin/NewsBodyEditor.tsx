import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color, FontSize, TextStyle } from "@tiptap/extension-text-style";
import { FiCheck, FiChevronDown, FiChevronUp } from "react-icons/fi";
import {
  MAX_NEWS_TEXT_SIZE,
  MIN_NEWS_TEXT_SIZE,
  NEWS_TEXT_COLORS,
  serializeNewsBody,
  toNewsBodyDocument,
} from "../../lib/newsBody";

const control =
  "min-h-[44px] rounded-md border border-white/20 px-3 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tech-gold disabled:opacity-50";
const sizeStep =
  "flex min-w-8 flex-1 items-center justify-center text-gray-300 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tech-gold disabled:opacity-50";
const colorOptions = [
  { label: "Default color", value: "", swatch: "#d1d5db" },
  ...NEWS_TEXT_COLORS.map((color) => ({ ...color, swatch: color.value })),
];
const clampSize = (size: number) =>
  Math.min(MAX_NEWS_TEXT_SIZE, Math.max(MIN_NEWS_TEXT_SIZE, Math.round(size)));

export default function NewsBodyEditor({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (body: string) => void;
  disabled?: boolean;
}) {
  const change = useRef(onChange);
  const lastValue = useRef(value);
  const [initialContent] = useState(() => toNewsBodyDocument(value));
  const [sizeInput, setSizeInput] = useState<string | null>(null);
  const [colorsOpen, setColorsOpen] = useState(false);
  const colorTrigger = useRef<HTMLButtonElement>(null);
  change.current = onChange;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
        blockquote: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        link: false,
      }),
      TextStyle,
      Color,
      FontSize,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-labelledby": "news-body-label",
        "aria-describedby": "news-body-hint",
        "aria-multiline": "true",
        class:
          "min-h-[180px] whitespace-pre-wrap break-words px-4 py-3 text-base leading-relaxed text-gray-100 outline-none [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:font-outfit [&_h2]:text-2xl [&_h2]:font-semibold [&_p+p]:mt-4",
      },
    },
    onUpdate: ({ editor: instance }) => {
      const body = serializeNewsBody(instance.getJSON());
      lastValue.current = body;
      change.current(body);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor || value === lastValue.current) return;
    lastValue.current = value;
    editor.commands.setContent(toNewsBodyDocument(value), {
      emitUpdate: false,
    });
  }, [editor, value]);

  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => ({
      bold: instance?.isActive("bold") ?? false,
      italic: instance?.isActive("italic") ?? false,
      underline: instance?.isActive("underline") ?? false,
      heading: instance?.isActive("heading", { level: 2 }) ?? false,
      color:
        (instance?.getAttributes("textStyle").color as string | undefined) ??
        "",
      size:
        (instance?.getAttributes("textStyle").fontSize as string | undefined) ??
        "",
    }),
  });

  if (!editor) return null;
  const selectedSize = state?.size?.endsWith("px")
    ? state.size.slice(0, -2)
    : "";
  const currentSize = sizeInput ?? selectedSize;
  const selectedColor =
    colorOptions.find((option) => option.value === state?.color) ??
    colorOptions[0];
  const applySize = (size: string) => {
    if (size === selectedSize) return;
    if (size) editor.commands.setFontSize(`${size}px`);
    else editor.commands.unsetFontSize();
  };
  const commitSize = (size: string) => {
    if (size === "") applySize("");
    else if (Number.isFinite(Number(size)))
      applySize(String(clampSize(Number(size))));
  };
  const stepSize = (step: number) => {
    const value = currentSize ? Number(currentSize) : 16;
    const next = String(
      clampSize((Number.isFinite(value) ? value : 16) + step)
    );
    setSizeInput((input) => (input === null ? null : next));
    applySize(next);
  };
  const keepSelection = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();
  const formatButton = (
    label: string,
    active: boolean,
    action: () => void,
    content: React.ReactNode
  ) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={keepSelection}
      onClick={action}
      className={`${control} ${
        active
          ? "border-tech-gold bg-tech-gold/15 text-tech-gold"
          : "bg-deep-space hover:border-white/40"
      }`}
    >
      {content}
    </button>
  );

  return (
    <div
      className="mt-2 overflow-hidden rounded-lg border border-white/20 bg-white/5 focus-within:border-tech-gold focus-within:ring-2 focus-within:ring-tech-gold/40"
      onKeyDown={(event) => {
        if (event.key === "Escape" && colorsOpen) {
          event.preventDefault();
          event.stopPropagation();
          setColorsOpen(false);
          colorTrigger.current?.focus();
        }
      }}
    >
      <div
        role="group"
        aria-label="Article text formatting"
        className="flex flex-wrap items-center gap-2 border-b border-white/10 p-2"
      >
        {formatButton(
          "Bold",
          state?.bold ?? false,
          () => editor.chain().focus().toggleBold().run(),
          <strong>B</strong>
        )}
        {formatButton(
          "Italic",
          state?.italic ?? false,
          () => editor.chain().focus().toggleItalic().run(),
          <em>I</em>
        )}
        {formatButton(
          "Underline",
          state?.underline ?? false,
          () => editor.chain().focus().toggleUnderline().run(),
          <span className="underline">U</span>
        )}
        {formatButton(
          "Heading",
          state?.heading ?? false,
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          "Heading"
        )}
        <div className="flex min-h-[44px] items-stretch rounded-md border border-white/20 bg-deep-space">
          <input
            type="number"
            min={MIN_NEWS_TEXT_SIZE}
            max={MAX_NEWS_TEXT_SIZE}
            step={1}
            aria-label="Text size in pixels"
            aria-describedby="news-text-size-hint"
            title={`Text size, ${MIN_NEWS_TEXT_SIZE} to ${MAX_NEWS_TEXT_SIZE} px`}
            placeholder="Auto"
            value={currentSize}
            disabled={disabled}
            className="w-14 rounded-l-md bg-transparent px-2 text-center text-sm text-white outline-none [appearance:textfield] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tech-gold [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            onFocus={() => setSizeInput(selectedSize)}
            onChange={(event) => {
              const value = event.target.value;
              setSizeInput(value);
              if (value && event.target.validity.valid)
                applySize(String(Number(value)));
            }}
            onBlur={(event) => {
              if (!event.target.validity.badInput)
                commitSize(event.target.value);
              setSizeInput(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                event.currentTarget.blur();
                editor.commands.focus();
              } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();
                stepSize(event.key === "ArrowUp" ? 1 : -1);
              }
            }}
          />
          <span id="news-text-size-hint" className="sr-only">
            {MIN_NEWS_TEXT_SIZE} to {MAX_NEWS_TEXT_SIZE} pixels. Clear the field
            to restore the default size.
          </span>
          <span
            aria-hidden="true"
            className="self-center pr-2 text-xs text-gray-400"
          >
            px
          </span>
          <div className="flex flex-col border-l border-white/20">
            <button
              type="button"
              aria-label="Increase text size"
              title="Increase text size"
              className={sizeStep}
              disabled={disabled || Number(currentSize) >= MAX_NEWS_TEXT_SIZE}
              onMouseDown={keepSelection}
              onClick={() => stepSize(1)}
            >
              <FiChevronUp aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Decrease text size"
              title="Decrease text size"
              className={`${sizeStep} border-t border-white/20`}
              disabled={
                disabled ||
                (currentSize !== "" &&
                  Number(currentSize) <= MIN_NEWS_TEXT_SIZE)
              }
              onMouseDown={keepSelection}
              onClick={() => stepSize(-1)}
            >
              <FiChevronDown aria-hidden="true" />
            </button>
          </div>
        </div>
        <button
          ref={colorTrigger}
          type="button"
          aria-label={`Text color: ${selectedColor.label}`}
          aria-expanded={colorsOpen}
          aria-controls={colorsOpen ? "news-text-colors" : undefined}
          disabled={disabled}
          className={`${control} inline-flex items-center gap-2 bg-deep-space hover:border-white/40`}
          onMouseDown={keepSelection}
          onClick={() => setColorsOpen((open) => !open)}
        >
          <span
            aria-hidden="true"
            className="h-4 w-4 rounded-sm border border-white/20"
            style={{ backgroundColor: selectedColor.swatch }}
          />
          {selectedColor.label}
          <FiChevronDown aria-hidden="true" className="text-gray-400" />
        </button>
      </div>
      {colorsOpen && (
        <div
          id="news-text-colors"
          role="group"
          aria-label="Text colors"
          className="grid grid-cols-2 gap-1 border-b border-white/10 bg-deep-space p-2 sm:grid-cols-4"
        >
          {colorOptions.map((color) => (
            <button
              key={color.value}
              type="button"
              aria-pressed={color.value === selectedColor.value}
              disabled={disabled}
              onMouseDown={keepSelection}
              onClick={() => {
                const command = editor.chain().focus();
                if (color.value) command.setColor(color.value).run();
                else command.unsetColor().run();
                setColorsOpen(false);
              }}
              className="flex min-h-[44px] items-center gap-2 rounded-md px-2 text-left text-sm text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-tech-gold"
            >
              <span
                aria-hidden="true"
                className="h-4 w-4 shrink-0 rounded-sm border border-white/20"
                style={{ backgroundColor: color.swatch }}
              />
              {color.label}
              {color.value === selectedColor.value && (
                <FiCheck
                  aria-hidden="true"
                  className="ml-auto shrink-0 text-tech-gold"
                />
              )}
            </button>
          ))}
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
