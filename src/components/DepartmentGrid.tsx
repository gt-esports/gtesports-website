import { departments } from "../data/recruitmentData";
import DepartmentCard from "./DepartmentCard";

function DepartmentGrid() {
  return (
    <section className="w-full px-4 pb-20">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-center font-outfit text-3xl font-bold uppercase tracking-widest text-white">
          Our <span className="text-tech-gold">Departments</span>
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <DepartmentCard key={dept.name} {...dept} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DepartmentGrid;
