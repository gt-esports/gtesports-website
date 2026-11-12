import { supabase } from "./supabase";

export const NEWS_COVER_BUCKET = "news-covers";
export const MAX_NEWS_COVER_BYTES = 5 * 1024 * 1024;

const contentTypes = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
} as const;

export type NewsCoverFormat = keyof typeof contentTypes;

export async function validateNewsCover(file: File): Promise<NewsCoverFormat> {
  if (!file.size || file.size > MAX_NEWS_COVER_BYTES) {
    throw new Error("Choose a nonempty image up to 5 MB.");
  }

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpg";
  }

  if (
    [137, 80, 78, 71, 13, 10, 26, 10].every(
      (byte, index) => bytes[index] === byte
    )
  ) {
    return "png";
  }

  if (
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) {
    return "webp";
  }

  throw new Error("Choose a JPG, PNG, or WebP image.");
}

export async function uploadNewsCover(file: File): Promise<string> {
  const extension = await validateNewsCover(file);
  const path = `covers/${crypto.randomUUID()}.${extension}`;
  const contentType = contentTypes[extension];
  const body = file.slice(0, file.size, contentType);
  const { error } = await supabase.storage
    .from(NEWS_COVER_BUCKET)
    .upload(path, body, {
      contentType,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw new Error(`Unable to upload the cover image: ${error.message}`);
  }

  return path;
}

export function getNewsCoverUrl(path: string): string {
  return supabase.storage.from(NEWS_COVER_BUCKET).getPublicUrl(path).data
    .publicUrl;
}
