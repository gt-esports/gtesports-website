import { supabase } from './supabase';

export const HEADSHOT_BUCKET = 'team-headshots';
export const MAX_HEADSHOT_BYTES = 5 * 1024 * 1024;
const contentTypes = {
  jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
};

export async function validateHeadshot(file: File) {
  if (!file.size || file.size > MAX_HEADSHOT_BYTES) throw new Error('Choose a nonempty image up to 5 MB.');
  // Browser MIME types can be missing or inferred from a misleading filename.
  // Use supported image signatures for both validation and Storage metadata.
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpg';
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte)) return 'png';
  if (String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP') return 'webp';
  throw new Error('This file does not contain a JPG, PNG, or WebP image. Export the photo in one of these formats and try again.');
}

export async function uploadHeadshot(file: File) {
  const extension = await validateHeadshot(file);
  const path = `headshots/${crypto.randomUUID()}.${extension}`;
  const contentType = contentTypes[extension];
  // Multipart uploads read Blob.type; an options override alone leaves File.type
  // in the part header. Keep the original bytes while correcting that metadata.
  const body = file.slice(0, file.size, contentType);
  const { error } = await supabase.storage.from(HEADSHOT_BUCKET).upload(path, body, {
    contentType, cacheControl: '31536000', upsert: false,
  });
  if (error) throw new Error(`Unable to upload the headshot: ${error.message}`);
  return supabase.storage.from(HEADSHOT_BUCKET).getPublicUrl(path).data.publicUrl;
}
