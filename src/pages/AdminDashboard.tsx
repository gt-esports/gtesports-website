import { Link } from 'react-router-dom';
import { FiArrowRight, FiEdit3, FiFileText, FiLayout, FiShield, FiUsers } from 'react-icons/fi';

const groups = [
  {
    id: 'daily',
    title: 'Day-to-day',
    tools: [
      { title: 'Applications', description: 'Review leadership and department applications.', to: '/admin/applications', icon: FiFileText },
      { title: 'News', description: 'Write, publish, and edit news posts.', to: '/admin/news', icon: FiEdit3 },
    ],
  },
  {
    id: 'community',
    title: 'Community',
    tools: [
      { title: 'Marketing contacts', description: 'Manage subscribers and alumni, or import a spreadsheet.', to: '/admin/contacts', icon: FiUsers },
    ],
  },
  {
    id: 'settings',
    title: 'Website settings',
    tools: [
      { title: 'Site content', description: 'Edit About Us, FAQs, and Leadership.', to: '/admin/content', icon: FiLayout },
      { title: 'Admin access', description: 'Grant or remove permission to manage the website.', to: '/admin/access', icon: FiShield },
    ],
  },
];

export default function AdminDashboard() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <header className="border-b border-tech-gold/30 pb-8">
        <h1 className="font-outfit text-3xl font-bold text-white sm:text-4xl">Administration</h1>
        <p className="mt-3 text-gray-300">Manage GT Esports. Choose a tool to get started.</p>
      </header>
      <div className="mt-8 space-y-8">
        {groups.map(group => (
          <section key={group.id} aria-labelledby={`admin-${group.id}`}>
            <h2 id={`admin-${group.id}`} className="mb-4 font-outfit text-lg font-semibold text-gray-300">{group.title}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.tools.map(({ title, description, to, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`group flex items-start gap-4 rounded-xl border p-5 transition-colors hover:border-tech-gold/60 hover:bg-tech-gold/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tech-gold sm:p-6 ${group.id === 'daily' ? 'border-tech-gold/30 bg-white/5' : 'border-white/10'}`}
                >
                  <Icon aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-tech-gold" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-outfit text-xl font-semibold text-white group-hover:text-tech-gold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">{description}</p>
                  </div>
                  <FiArrowRight aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-tech-gold" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
