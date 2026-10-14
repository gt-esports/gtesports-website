import { Link } from 'react-router-dom';
import MarketingContacts from '../components/admin/MarketingContacts';

export default function MarketingContactsPage() {
  return <section className="mx-auto max-w-5xl px-6 py-16">
    <Link to="/admin" className="mb-8 inline-block text-sm text-tech-gold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tech-gold"><span aria-hidden="true">← </span>Back to administration</Link>
    <MarketingContacts />
  </section>;
}
