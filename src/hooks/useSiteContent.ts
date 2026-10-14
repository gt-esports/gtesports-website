import { useEffect, useState } from 'react';
import { defaultContent } from '../data/siteContent';
import type { ContentSection } from '../data/contentSchema';
import { fetchContent } from '../lib/siteContent';

export function useSiteContent<K extends ContentSection>(section: K) {
  const [content, setContent] = useState(defaultContent[section]);
  useEffect(() => {
    let active = true;
    void fetchContent(section).then(result => {
      if (active) setContent(result.content);
    }).catch((error: unknown) => console.error('Site content unavailable; using bundled content.', error));
    return () => { active = false; };
  }, [section]);
  return content;
}
