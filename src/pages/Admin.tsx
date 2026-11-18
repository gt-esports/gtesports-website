import { useEffect, useState } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import AdminContentPage from './AdminContent';

export default function Admin() {
  const showingContent = useMatch('/admin/content') !== null;
  const [contentOpened, setContentOpened] = useState(showingContent);

  useEffect(() => {
    if (showingContent) setContentOpened(true);
  }, [showingContent]);

  return (
    <>
      {/* Load editors on first visit, then preserve drafts across admin pages. */}
      {(showingContent || contentOpened) && (
        <div hidden={!showingContent}><AdminContentPage /></div>
      )}
      <Outlet />
    </>
  );
}
