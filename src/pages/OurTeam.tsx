import { useState, type FC } from "react";
import ProfileCard from "../components/ProfileCard";
import type { TeamMember } from "../data/contentSchema";
import { teamDepartments } from "../data/contentSchema";
import { useSiteContent } from "../hooks/useSiteContent";

interface DepartmentProps {
  id: string;
  title: string;
  members: TeamMember[];
}

const Department: FC<DepartmentProps> = ({ id, title, members }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `department-${id}-team`;

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white/[0.03] transition-colors ${
        isOpen ? "border-tech-gold/30 bg-white/[0.05]" : "border-white/10"
      }`}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left font-outfit text-xl font-bold tracking-wider text-white transition-colors hover:text-tech-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tech-gold sm:px-8 sm:text-2xl"
      >
        <span>{title}</span>
        <span
          aria-hidden="true"
          className={`relative h-6 w-6 shrink-0 rounded-full border transition-colors ${
            isOpen ? "border-tech-gold" : "border-white/20"
          }`}
        >
          <span className="absolute left-1/2 top-1/2 h-px w-2.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
          <span
            className={`absolute left-1/2 top-1/2 h-2.5 w-px -translate-x-1/2 -translate-y-1/2 bg-current transition-transform duration-300 ${
              isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
            }`}
          />
        </span>
      </button>

      <div
        id={panelId}
        aria-hidden={!isOpen}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-white/10 px-6 py-8 sm:px-8">
            {members.length > 0 ? (
              <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {members.map((member) => (
                  <div key={member.id} className="flex h-full justify-center">
                    <ProfileCard {...member} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center font-inter text-gray-400">
                Leadership profiles coming soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OurTeam: FC = () => {
  const content = useSiteContent("team");
  const introduction = content.introduction
    .replace(/\bGeorgia Tech\b(?! Esports Organization)/g, "Georgia Tech Esports Organization")
    .replace(/\bGT Esports\b(?! Organization)/g, "GT Esports Organization");
  const renderSection = (title: string, members: TeamMember[]) => {
    return (
      <section className="py-16">
        <div className="mb-12 flex flex-col items-center">
          <h2 className="mb-4 text-center font-outfit text-4xl font-bold tracking-wider text-tech-gold">
            {title}
          </h2>
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-tech-gold to-transparent opacity-50"></div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member) => (
            <div key={member.id} className="flex justify-center h-full">
              <ProfileCard {...member} />
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-deep-space pt-24 pb-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-tech-gold/5 blur-[120px]"></div>
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[500px] w-[500px] translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="mb-6 font-outfit text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
            OUR <span className="bg-gradient-to-r from-tech-gold to-yellow-200 bg-clip-text text-transparent">LEADERSHIP</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400 font-inter">
            Meet the student leaders and department members behind GT Esports Organization. {introduction}
          </p>
        </div>

        {renderSection("EXECUTIVES", content.executives)}

        <section aria-labelledby="departments-heading" className="pb-16">
          <div className="mb-10 flex flex-col items-center">
            <h2
              id="departments-heading"
              className="mb-4 text-center font-outfit text-4xl font-bold tracking-wider text-tech-gold"
            >
              DEPARTMENTS
            </h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-tech-gold to-transparent opacity-50" />
          </div>

          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-2 sm:px-6">
            {teamDepartments.map(({ id, title }) => (
              <Department key={id} id={id} title={title} members={content.departments.find(department => department.id === id)?.members ?? []} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OurTeam;
