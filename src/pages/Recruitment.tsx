import RecruitmentBanner from "../components/RecruitmentBanner";
import DepartmentGrid from "../components/DepartmentGrid";
import RecruitmentForm from "../components/RecruitmentForm";

function Recruitment() {
  return (
    <div className="min-h-screen w-full bg-deep-space pt-24">
      <section className="relative w-full px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 font-outfit text-5xl font-bold uppercase tracking-widest text-white md:text-6xl">
              JOIN THE <span className="text-tech-gold">TEAM</span>
            </h1>
            <div className="mx-auto h-1 w-24 bg-tech-gold"></div>
          </div>

          <RecruitmentBanner />
        </div>
      </section>

      <DepartmentGrid />
      <RecruitmentForm />
    </div>
  );
}

export default Recruitment;
