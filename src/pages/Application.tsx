import RecruitmentForm from "../components/RecruitmentForm";

function Application() {
  return (
    <div className="min-h-screen w-full bg-deep-space pt-24">
      <header className="mx-auto max-w-4xl px-6 pb-4 pt-12 text-center sm:pt-20">
        <h1 className="mb-6 font-outfit text-5xl font-bold uppercase tracking-widest text-white md:text-6xl">
          LEADERSHIP <span className="text-tech-gold">APPLICATION</span>
        </h1>
        <div className="mx-auto h-1 w-24 bg-tech-gold"></div>
      </header>
      <RecruitmentForm />
    </div>
  );
}

export default Application;
