import { departments } from "../data/recruitmentData";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 p-3 font-inter text-white placeholder-gray-500 focus:border-tech-gold focus:outline-none";

function RecruitmentForm() {
  return (
    <section id="apply" className="w-full scroll-mt-24 px-4 pb-20">
      <div className="container mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
        <h2 className="mb-2 font-outfit text-3xl font-bold uppercase text-white">
          Application
        </h2>
        <p className="mb-8 font-inter text-sm text-gray-400">
          Applications will open here when recruitment begins.
        </p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              placeholder="First name"
              aria-label="First name"
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Last name"
              aria-label="Last name"
              className={inputClass}
            />
          </div>
          <input
            type="email"
            placeholder="GT email"
            aria-label="GT email"
            className={inputClass}
          />
          <div className="flex flex-col gap-4 sm:flex-row">
            <select aria-label="Year" defaultValue="" className={inputClass}>
              <option value="" disabled>
                Year
              </option>
              {[
                "1st year",
                "2nd year",
                "3rd year",
                "4th year",
                "5th year+",
                "Graduate",
              ].map((y) => (
                <option key={y} value={y} className="bg-deep-space">
                  {y}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Major"
              aria-label="Major"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            {["First choice department", "Second choice (optional)"].map(
              (label) => (
                <select
                  key={label}
                  aria-label={label}
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    {label}
                  </option>
                  {departments.map(({ name }) => (
                    <option key={name} value={name} className="bg-deep-space">
                      {name}
                    </option>
                  ))}
                </select>
              )
            )}
          </div>
          <input
            type="url"
            placeholder="Portfolio / GitHub link (optional)"
            aria-label="Portfolio or GitHub link"
            className={inputClass}
          />
          <label className="block font-inter text-sm text-gray-400">
            Resume (PDF, optional)
            <input
              type="file"
              accept=".pdf"
              className={`${inputClass} mt-2 file:mr-4 file:rounded-full file:border-0 file:bg-tech-gold file:px-4 file:py-1 file:font-outfit file:text-xs file:font-bold file:text-white`}
            />
          </label>
          <textarea
            rows={4}
            placeholder="Why do you want to join?"
            aria-label="Why do you want to join?"
            className={inputClass}
          />
          <button
            type="submit"
            disabled
            className="w-full rounded-full bg-tech-gold/50 py-3 font-outfit text-sm font-bold text-white"
          >
            SUBMIT (COMING SOON)
          </button>
        </form>
      </div>
    </section>
  );
}

export default RecruitmentForm;
