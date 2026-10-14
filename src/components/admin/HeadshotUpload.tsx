import { useContext, useEffect, useId, useRef, useState } from 'react';
import { uploadHeadshot } from '../../lib/headshots';
import { UploadActivityContext } from './UploadActivityContext';

export default function HeadshotUpload({ image, name, onChange }: {
  image: string; name: string; onChange: (url: string) => void;
}) {
  const id = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const mounted = useRef(true);
  const activity = useContext(UploadActivityContext);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const upload = async (file: File) => {
    setUploading(true); setError(null); setNotice(''); activity(true);
    try {
      const url = await uploadHeadshot(file);
      if (mounted.current) {
        onChange(url);
        setNotice('Uploaded. Publish changes to update the team page.');
      }
    } catch (err: unknown) {
      if (mounted.current) setError(err instanceof Error ? err.message : 'Unable to upload the headshot.');
    } finally {
      activity(false);
      if (mounted.current) setUploading(false);
    }
  };

  return <div className="space-y-3 rounded-lg border border-white/10 p-4">
    {image && <img src={image} alt={`${name || 'Member'} headshot preview`} className="h-24 w-24 rounded-full object-cover" />}
    <label htmlFor={id} className="block text-sm font-medium text-gray-200">Upload headshot</label>
    <input id={id} type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} aria-describedby={`${id}-hint`} className="block w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-tech-gold file:px-4 file:py-2 file:font-semibold file:text-deep-space disabled:opacity-50" onChange={event => {
      const file = event.currentTarget.files?.[0];
      event.currentTarget.value = '';
      if (file) void upload(file);
    }} />
    <p id={`${id}-hint`} className="text-xs text-gray-400">JPG, PNG, or WebP, up to 5 MB. Uploaded headshots are publicly accessible.</p>
    {uploading && <p role="status" className="text-sm text-tech-gold">Uploading headshot...</p>}
    {error && <p role="alert" className="text-sm text-red-200">{error}</p>}
    {notice && <p role="status" className="text-sm text-green-300">{notice}</p>}
    {image && <button type="button" disabled={uploading} onClick={() => { onChange(''); setNotice(''); setError(null); }} className="text-sm text-gray-300 underline">Remove headshot</button>}
  </div>;
}
