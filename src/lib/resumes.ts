import { supabase } from './supabase';

export const RESUME_BUCKET = 'Resumes';
export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export async function validateResume(file: File) {
  if (!file.size || file.size > MAX_RESUME_BYTES) throw new Error('Choose a nonempty PDF up to 5 MB.');
  const bytes = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  if (String.fromCharCode(...bytes.slice(0, 4)) !== '%PDF') {
    throw new Error('This file is not a PDF. Export the resume as a PDF and try again.');
  }
}

export async function uploadResume(file: File) {
  await validateResume(file);
  const path = `resumes/${crypto.randomUUID().toLowerCase()}.pdf`;
  const body = file.slice(0, file.size, 'application/pdf');
  const { error } = await supabase.storage.from(RESUME_BUCKET).upload(path, body, {
    contentType: 'application/pdf', upsert: false,
  });
  if (error) throw new Error('Unable to upload the resume. Use a PDF up to 5 MB.');
  return path;
}
