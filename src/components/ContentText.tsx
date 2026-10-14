import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { isSafeUrl } from '../data/contentSchema';

// Support editable [label](URL) links without interpreting HTML.
export default function ContentText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^\s)]+\))/g);
  return <>{parts.map((part, index) => {
    const match = /^\[([^\]]+)\]\(([^\s)]+)\)$/.exec(part);
    if (!match || !isSafeUrl(match[2])) return <Fragment key={index}>{part}</Fragment>;
    return match[2].startsWith('/')
      ? <Link key={index} to={match[2]} className="underline hover:text-tech-gold">{match[1]}</Link>
      : <a key={index} href={match[2]} className="underline hover:text-tech-gold">{match[1]}</a>;
  })}</>;
}
