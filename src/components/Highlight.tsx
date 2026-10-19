import { useState } from "react";
import type { HighlightProps } from "../types";
import { getYouTubeEmbedUrl } from "../lib/highlights";

export default function Highlight({ src, title = "Game highlight", poster, captions = [], controls = true, isOpen, autoPlay = false, className = "" }: HighlightProps) {
  const [failed, setFailed] = useState(false);
  if (!isOpen) return null;
  const youtube = getYouTubeEmbedUrl(src);
  let safeSource: string | null = null;
  try {
    const url = new URL(src);
    if (["https:", "http:"].includes(url.protocol) && /\.(mp4|webm|ogg)$/i.test(url.pathname)) safeSource = url.href;
  } catch { /* Unsupported sources use the fallback below. */ }
  const fallback = failed || (!youtube && !safeSource);

  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-black ${className}`}>
      {fallback ? (
        <p role="status" className="px-6 py-10 text-center text-sm text-gray-400">This highlight is unavailable right now.</p>
      ) : youtube ? (
        <iframe src={`${youtube}?autoplay=${autoPlay ? 1 : 0}&rel=0`} title={title}
          className="aspect-video w-full" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <video src={safeSource ?? undefined} controls={controls} preload="metadata" poster={poster} autoPlay={autoPlay}
          playsInline aria-label={title} onError={() => setFailed(true)} className="aspect-video w-full object-contain">
          {captions.map((track) => <track key={track.src} kind="captions" {...track} />)}
          Your browser does not support video playback.
        </video>
      )}
    </div>
  );
}
