import { FaChevronDown, FaClock } from "react-icons/fa";
import { departments } from "../data/recruitmentData";

function DepartmentCard({
  name,
  icon,
  blurb,
  hours,
  roles,
}: (typeof departments)[number]) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tech-gold/20 text-tech-gold">
          {icon}
        </div>
        <span className="rounded-full border border-white/20 px-3 py-1 font-outfit text-xs font-bold uppercase text-gray-400">
          Closed
        </span>
      </div>
      <h3 className="font-outfit text-xl font-bold uppercase text-white">
        {name}
      </h3>
      <p className="font-inter text-sm text-gray-400">{blurb}</p>
      <div className="flex items-center gap-2 font-inter text-xs text-gray-500">
        <FaClock /> {hours}
      </div>
      <details className="group/roles mt-auto border-t border-white/10 pt-4">
        <summary className="flex cursor-pointer list-none items-center justify-between font-outfit text-sm font-bold uppercase text-white hover:text-tech-gold">
          {roles.length} Roles
          <FaChevronDown className="transition-transform group-open/roles:rotate-180" />
        </summary>
        <ul className="mt-3 flex flex-wrap gap-2">
          {roles.map((role) => (
            <li
              key={role}
              className="rounded-full bg-white/10 px-3 py-1 font-inter text-xs text-gray-300"
            >
              {role}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

export default DepartmentCard;
