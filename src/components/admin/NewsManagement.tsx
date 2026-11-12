import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import NewsArticleContent from "../NewsArticleContent";
import {
  fetchAdminNews,
  makeNewsSlug,
  saveNewsPost,
  deleteNewsPost,
  type ManagedNewsArticle,
  type NewsPostInput,
} from "../../lib/adminNews";
import { formatNewsDate, newsCategories } from "../../lib/newsDisplay";
import { getNewsCoverUrl, uploadNewsCover } from "../../lib/newsCovers";

const NewsBodyEditor = lazy(() => import("./NewsBodyEditor"));

const blank = (): NewsPostInput => ({
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  author: "",
  category: "Community",
  cover_url: "",
  cover_path: "",
  cover_alt: "",
  featured: false,
  status: "draft",
});
const field =
  "mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-tech-gold focus:outline-none focus:ring-2 focus:ring-tech-gold/40";
const hint = "mt-1 block text-sm font-normal text-gray-400";
const button =
  "min-h-[44px] rounded-lg border border-white/20 px-5 text-sm text-white hover:border-tech-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tech-gold disabled:opacity-50";
const primary =
  "min-h-[44px] rounded-lg bg-tech-gold px-5 text-sm font-semibold text-deep-space hover:bg-gold-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tech-gold disabled:opacity-50";

export default function NewsManagement() {
  const [posts, setPosts] = useState<ManagedNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<ManagedNewsArticle | null>(null);
  const [draft, setDraft] = useState<NewsPostInput>(blank);
  const [initial, setInitial] = useState<NewsPostInput>(blank);
  const [autoSlug, setAutoSlug] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const uploadedCover = useRef<{ file: File; path: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const previewTitle = useRef<HTMLHeadingElement>(null);
  const previewButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const formAlert = useRef<HTMLParagraphElement>(null);
  const newPostButton = useRef<HTMLButtonElement>(null);
  const cancelDeletion = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const busy = useRef(false);

  const load = async () => {
    setLoading(true);
    setListError("");
    try {
      setPosts(await fetchAdminNews());
    } catch (error) {
      setListError(
        error instanceof Error
          ? error.message
          : "Couldn't load posts. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (formError) formAlert.current?.focus();
  }, [formError]);

  useEffect(() => {
    if (confirmDelete) cancelDeletion.current?.focus();
  }, [confirmDelete]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview("");
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  useEffect(() => {
    if (previewing) previewTitle.current?.focus();
  }, [previewing]);

  const begin = (post?: ManagedNewsArticle) => {
    const next: NewsPostInput = post
      ? {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          body: post.body,
          author: post.author,
          category: post.category,
          cover_url: post.cover_url,
          cover_path: post.cover_path ?? "",
          cover_alt: post.cover_alt,
          featured: post.featured,
          status: post.status,
        }
      : blank();
    opener.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setEditing(post ?? null);
    setDraft(next);
    setInitial(next);
    setAutoSlug(!post);
    setComposerOpen(true);
    setPreviewing(false);
    setCoverFile(null);
    uploadedCover.current = null;
    if (fileInput.current) fileInput.current.value = "";
    setConfirmDiscard(false);
    setConfirmDelete(null);
    setFormError("");
    setNotice("");
    dialog.current?.showModal();
    window.setTimeout(() => titleInput.current?.focus(), 0);
  };
  const update = <K extends keyof NewsPostInput>(
    key: K,
    value: NewsPostInput[K]
  ) => setDraft((current) => ({ ...current, [key]: value }));
  const close = (force = false) => {
    if (busy.current) return;
    if (
      !force &&
      (coverFile || JSON.stringify(draft) !== JSON.stringify(initial))
    ) {
      setConfirmDiscard(true);
      return;
    }
    dialog.current?.close();
  };
  const save = async (status: NewsPostInput["status"]) => {
    if (busy.current) return;
    busy.current = true;
    setSaving(true);
    setFormError("");
    try {
      const saved = await saveNewsPost(
        { ...draft, status },
        editing ?? undefined,
        coverFile
          ? async () => {
              if (uploadedCover.current?.file === coverFile)
                return uploadedCover.current.path;
              const path = await uploadNewsCover(coverFile);
              uploadedCover.current = { file: coverFile, path };
              return path;
            }
          : undefined
      );
      setPosts((current) => [
        saved,
        ...current.filter((post) => post.id !== saved.id),
      ]);
      setNotice(
        status === "draft"
          ? editing?.status === "published"
            ? "Post moved to drafts."
            : "Draft saved."
          : editing?.status === "published"
          ? "Changes saved."
          : "Post published."
      );
      busy.current = false;
      close(true);
    } catch (error) {
      setPreviewing(false);
      setFormError(
        error instanceof Error
          ? error.message
          : "Couldn't save this post. Your edits are still here."
      );
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };
  const cover = coverFile
    ? coverPreview
    : draft.cover_path
    ? getNewsCoverUrl(draft.cover_path)
    : draft.cover_url;
  const hasCover = Boolean(coverFile || draft.cover_path || draft.cover_url);
  const removeCover = () => {
    setCoverFile(null);
    uploadedCover.current = null;
    if (fileInput.current) fileInput.current.value = "";
    setDraft((current) => ({
      ...current,
      cover_url: "",
      cover_path: "",
      cover_alt: "",
    }));
  };
  const remove = async (post: ManagedNewsArticle) => {
    if (removing) return;
    setRemoving(post.id);
    setListError("");
    setNotice("");
    try {
      await deleteNewsPost(post);
      setPosts((current) => current.filter((item) => item.id !== post.id));
      setNotice("Post deleted.");
    } catch (error) {
      setListError(
        error instanceof Error
          ? error.message
          : "Couldn't delete this post. Please try again."
      );
    } finally {
      setRemoving(null);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-outfit text-3xl font-bold text-white">
            News posts
          </h1>
          <p className="mt-2 text-gray-400">
            Write, edit, and publish stories for the community.
          </p>
        </div>
        <button
          ref={newPostButton}
          type="button"
          disabled={loading || !!removing}
          onClick={() => begin()}
          className={primary}
        >
          New post
        </button>
      </header>
      {notice && (
        <p
          role="status"
          className="rounded-lg border border-green-300/30 bg-green-300/10 p-3 text-green-200"
        >
          {notice}
        </p>
      )}
      {listError && (
        <div
          role="alert"
          className="rounded-lg border border-red-300/30 bg-red-300/10 p-3 text-red-200"
        >
          <p>{listError}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-2 underline"
          >
            Reload posts
          </button>
        </div>
      )}
      {loading ? (
        <p role="status" className="py-12 text-center text-gray-300">
          Loading posts...
        </p>
      ) : !listError && posts.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
          <h2 className="font-outfit text-2xl font-semibold text-white">
            No posts yet
          </h2>
          <p className="mt-2 text-gray-400">
            Start a draft when you're ready to share an update.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="break-words font-outfit text-lg font-semibold text-white">
                    {post.title}
                  </h2>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-gray-200">
                    {post.status === "published" ? "Published" : "Draft"}
                  </span>
                  {post.featured && (
                    <span className="text-xs text-tech-gold">Featured</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-400">
                  {post.category}. Updated {formatNewsDate(post.updated_at)}.
                </p>
                <p className="mt-2 line-clamp-2 break-words text-sm text-gray-300">
                  {post.excerpt || "No preview yet."}
                </p>
              </div>
              {confirmDelete === post.id ? (
                <div className="space-y-2 sm:shrink-0">
                  <p role="status" className="text-sm text-gray-300">
                    Delete this post permanently?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      ref={cancelDeletion}
                      type="button"
                      disabled={!!removing}
                      className={button}
                      onClick={() => {
                        setConfirmDelete(null);
                        newPostButton.current?.focus();
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!!removing}
                      className={`${button} border-red-300/40 text-red-200`}
                      onClick={() => void remove(post)}
                    >
                      {removing === post.id ? "Deleting..." : "Delete post"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={!!removing}
                    onClick={() => begin(post)}
                    className={button}
                    aria-label={`Edit ${post.title}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={!!removing}
                    onClick={() => setConfirmDelete(post.id)}
                    className={button}
                    aria-label={`Delete ${post.title}`}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <dialog
        ref={dialog}
        onCancel={(event) => {
          event.preventDefault();
          if (confirmDiscard) setConfirmDiscard(false);
          else close();
        }}
        onClose={() => {
          setComposerOpen(false);
          setCoverFile(null);
          opener.current?.focus();
        }}
        aria-labelledby="news-composer-title"
        className="m-auto w-[calc(100%-1.5rem)] max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-deep-space p-0 text-white shadow-2xl backdrop:bg-black/80"
      >
        <form
          className="flex max-h-[90dvh] flex-col"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void save(editing?.status === "published" ? "published" : "draft");
          }}
        >
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-8">
            <div>
              <h2
                id="news-composer-title"
                className="font-outfit text-2xl font-bold"
              >
                {previewing
                  ? "Post preview"
                  : editing
                  ? "Edit post"
                  : "New post"}
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                {previewing
                  ? "Only you can see this preview."
                  : editing?.status === "published"
                  ? "Changes will appear on the News page."
                  : "Save a draft or publish when it's ready."}
              </p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => close()}
              className={button}
              aria-label="Close editor"
            >
              Close
            </button>
          </header>
          {previewing && (
            <div className="min-h-0 overflow-y-auto px-5 py-6 sm:px-8">
              <h3 ref={previewTitle} tabIndex={-1} className="sr-only">
                Preview of the public article
              </h3>
              <NewsArticleContent
                article={{
                  ...draft,
                  cover_path: "",
                  cover_url: cover,
                  published_at: editing?.published_at,
                }}
                preview
              />
            </div>
          )}
          <div hidden={previewing} className="min-h-0 overflow-y-auto">
            <fieldset
              disabled={saving}
              className="min-w-0 space-y-5 p-5 sm:px-8"
            >
              {formError && (
                <p
                  ref={formAlert}
                  tabIndex={-1}
                  role="alert"
                  className="rounded-lg border border-red-300/30 bg-red-300/10 p-3 text-red-200"
                >
                  {formError}
                </p>
              )}
              <div>
                <label
                  htmlFor="news-title"
                  className="text-sm font-medium text-gray-300"
                >
                  Title
                </label>
                <p id="news-title-hint" className={hint}>
                  Shown at the top of the article and on its News card.
                </p>
                <input
                  id="news-title"
                  aria-describedby="news-title-hint"
                  ref={titleInput}
                  maxLength={180}
                  value={draft.title}
                  onChange={(event) => {
                    const title = event.target.value;
                    setDraft((current) => ({
                      ...current,
                      title,
                      slug: autoSlug ? makeNewsSlug(title) : current.slug,
                    }));
                  }}
                  className={`${field} font-outfit text-xl font-semibold`}
                />
              </div>
              <div>
                <p
                  id="news-body-label"
                  className="text-sm font-medium text-gray-300"
                >
                  Article text
                </p>
                <p id="news-body-hint" className={hint}>
                  The full post readers see when they open it. Select text to
                  change its size, style, or color.
                </p>
                {composerOpen && (
                  <Suspense
                    fallback={
                      <p role="status" className={hint}>
                        Loading editor...
                      </p>
                    }
                  >
                    <NewsBodyEditor
                      value={draft.body}
                      onChange={(body) => update("body", body)}
                      disabled={saving}
                    />
                  </Suspense>
                )}
              </div>
              <div>
                <label
                  htmlFor="news-summary"
                  className="text-sm font-medium text-gray-300"
                >
                  Summary
                </label>
                <p id="news-summary-hint" className={hint}>
                  A short description for the News card and the line below the
                  article title.
                </p>
                <textarea
                  id="news-summary"
                  aria-describedby="news-summary-hint"
                  maxLength={400}
                  rows={2}
                  value={draft.excerpt}
                  onChange={(event) => update("excerpt", event.target.value)}
                  className={field}
                />
                <p className="text-right text-xs text-gray-400">
                  {draft.excerpt.length} / 400
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="news-author"
                    className="text-sm font-medium text-gray-300"
                  >
                    Author
                  </label>
                  <p id="news-author-hint" className={hint}>
                    The person or team credited on the post.
                  </p>
                  <input
                    id="news-author"
                    aria-describedby="news-author-hint"
                    maxLength={100}
                    value={draft.author}
                    onChange={(event) => update("author", event.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label
                    htmlFor="news-category"
                    className="text-sm font-medium text-gray-300"
                  >
                    Category
                  </label>
                  <p id="news-category-hint" className={hint}>
                    Where readers find the post on News.
                  </p>
                  <div className="relative">
                    <select
                      id="news-category"
                      aria-describedby="news-category-hint"
                      value={draft.category}
                      onChange={(event) =>
                        update(
                          "category",
                          event.target.value as NewsPostInput["category"]
                        )
                      }
                      className={`${field} appearance-none pr-10`}
                    >
                      {newsCategories.map((category) => (
                        <option
                          className="bg-deep-space text-white"
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-1/2 mt-0.5 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>
              </div>
              <fieldset className="space-y-3 rounded-xl border border-white/10 p-4">
                <legend className="px-2 text-sm font-semibold text-gray-200">
                  Cover image{" "}
                  <span className="font-normal text-gray-400">(optional)</span>
                </legend>
                <p id="news-cover-hint" className="text-sm text-gray-400">
                  Choose a JPG, PNG, or WebP up to 5 MB. The file uploads when
                  you save.
                </p>
                {cover && (
                  <img
                    src={cover}
                    alt={draft.cover_alt}
                    className="max-h-48 w-full rounded-lg bg-white/5 object-contain"
                  />
                )}
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  aria-label="Cover image file"
                  aria-describedby="news-cover-hint"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setCoverFile(file);
                      uploadedCover.current = null;
                    }
                  }}
                  className="w-full text-sm text-gray-300 file:mr-3 file:min-h-[44px] file:rounded-lg file:border file:border-white/20 file:bg-white/5 file:px-4 file:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tech-gold"
                />
                {hasCover && (
                  <>
                    <div>
                      <label
                        htmlFor="news-cover-alt"
                        className="text-sm font-medium text-gray-300"
                      >
                        Image description
                      </label>
                      <p id="news-cover-alt-hint" className={hint}>
                        Describe what's in the image for readers who can't see
                        it.
                      </p>
                      <input
                        id="news-cover-alt"
                        aria-describedby="news-cover-alt-hint"
                        maxLength={300}
                        value={draft.cover_alt}
                        onChange={(event) =>
                          update("cover_alt", event.target.value)
                        }
                        className={field}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeCover}
                      className={button}
                    >
                      Remove cover
                    </button>
                  </>
                )}
              </fieldset>
              <details className="rounded-xl border border-white/10 p-4">
                <summary className="cursor-pointer rounded-sm text-sm font-medium text-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tech-gold">
                  Post settings
                </summary>
                <div className="mt-4">
                  <label
                    htmlFor="news-slug"
                    className="text-sm font-medium text-gray-300"
                  >
                    Article link
                  </label>
                  <p id="news-slug-hint" className={`${hint} break-all`}>
                    /news/{draft.slug || "article-title"}.{" "}
                    {editing
                      ? "This link stays fixed after creation."
                      : "Use lowercase letters, numbers, and hyphens."}
                  </p>
                  <input
                    id="news-slug"
                    aria-describedby="news-slug-hint"
                    maxLength={120}
                    readOnly={!!editing}
                    value={draft.slug}
                    onChange={(event) => {
                      setAutoSlug(false);
                      update("slug", event.target.value);
                    }}
                    className={field}
                  />
                </div>
                <label className="mt-3 flex min-h-[44px] items-center gap-3 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(event) =>
                      update("featured", event.target.checked)
                    }
                    className="h-5 w-5 accent-tech-gold"
                  />
                  Feature this post on the News page
                </label>
              </details>
            </fieldset>
          </div>
          <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-white/10 bg-deep-space px-5 py-4 sm:px-8">
            {!confirmDiscard && (
              <button
                ref={previewButton}
                type="button"
                disabled={saving}
                className={`${button} mr-auto`}
                onClick={() => {
                  setPreviewing(!previewing);
                  if (previewing) previewButton.current?.focus();
                }}
              >
                {previewing ? "Back to editing" : "Preview post"}
              </button>
            )}
            {confirmDiscard ? (
              <>
                <p role="status" className="mr-auto text-sm text-gray-300">
                  Discard your unsaved changes?
                </p>
                <button
                  type="button"
                  onClick={() => setConfirmDiscard(false)}
                  className={button}
                >
                  Keep editing
                </button>
                <button
                  type="button"
                  onClick={() => close(true)}
                  className={button}
                >
                  Discard changes
                </button>
              </>
            ) : editing?.status === "published" ? (
              <>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void save("draft")}
                  className={button}
                >
                  Move to draft
                </button>
                <button type="submit" disabled={saving} className={primary}>
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </>
            ) : (
              <>
                <button type="submit" disabled={saving} className={button}>
                  {saving ? "Saving..." : "Save draft"}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void save("published")}
                  className={primary}
                >
                  {saving ? "Saving..." : "Publish"}
                </button>
              </>
            )}
          </footer>
        </form>
      </dialog>
    </div>
  );
}
