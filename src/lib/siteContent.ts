import { supabase } from './supabase';
import { defaultContent } from '../data/siteContent';
import { validateContent, type ContentMap, type ContentSection } from '../data/contentSchema';

export async function fetchContent<K extends ContentSection>(section: K) {
  const { data, error } = await supabase.from('site_content').select('content, revision').eq('section', section).maybeSingle();
  if (error) throw new Error('Unable to load site content. Please try again.');
  if (!data) return { content: defaultContent[section], revision: 0 };
  const content: unknown = data.content;
  validateContent(section, content);
  const revision: unknown = data.revision;
  if (typeof revision !== 'number') throw new Error('Invalid content version.');
  return { content, revision };
}

export async function publishContent<K extends ContentSection>(section: K, content: ContentMap[K], revision: number) {
  validateContent(section, content);
  const query = revision === 0
    ? supabase.from('site_content').insert({ section, content })
    : supabase.from('site_content').update({ content }).eq('section', section).eq('revision', revision);
  const { data, error } = await query.select('revision').maybeSingle();
  if (error?.code === '23505' || (!error && !data)) throw new Error('This section changed or your admin access was revoked. Reload the published content before trying again.');
  if (error) throw new Error('Unable to publish. Check your admin access and try again.');
  const nextRevision: unknown = data?.revision;
  if (typeof nextRevision !== 'number') throw new Error('Unable to confirm the saved version. Reload before trying again.');
  return nextRevision;
}
