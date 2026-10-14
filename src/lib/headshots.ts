import { supabase } from './supabase';

export const HEADSHOT_BUCKET = 'team-headshots';
export const MAX_HEADSHOT_BYTES = 5 * 1024 * 1024;
const extensions: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
};

export async function validateHeadshot(file: File) {
  if (!file.size || file.size > MAX_HEADSHOT_BYTES) throw new Error('Choose a nonempty image up to 5 MB.');
  const extension = extensions[file.type];
  if (!extension) throw new Error('Choose a JPG, PNG, or WebP image.');
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const signature = file.type === 'image/jpeg'
    ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    : file.type === 'image/png'
      ? [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte)
      : String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  if (!signature) throw new Error('This file is not a valid JPG, PNG, or WebP image.');
  return extension;
}

export async function uploadHeadshot(file: File) {
  const extension = await validateHeadshot(file);
  const path = `headshots/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(HEADSHOT_BUCKET).upload(path, file, {
    contentType: file.type, cacheControl: '31536000', upsert: false,
  });
  if (error) throw new Error('Unable to upload the headshot. Check your admin access and try again.');
  return supabase.storage.from(HEADSHOT_BUCKET).getPublicUrl(path).data.publicUrl;
}
