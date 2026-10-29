import { useRef, useState, type FormEvent } from "react";
import { departments } from "../data/recruitmentData";
import { submitLeadershipApplication } from "../lib/leadershipApplications";
import { uploadResume } from "../lib/resumes";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 p-3 font-inter text-white placeholder-gray-500 focus:border-tech-gold focus:outline-none";

const years = [
  "1st year",
  "2nd year",
  "3rd year",
  "4th year",
  "5th year+",
  "Graduate",
];

function RecruitmentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!formRef.current || submitting) return;

    const form = new FormData(formRef.current);
    setSubmitting(true);
    setMessage(null);
    setFailed(false);

    try {
      const resume = form.get("resume");
      const resume_path = resume instanceof File && resume.size > 0 ? await uploadResume(resume) : "";
      await submitLeadershipApplication({
        first_name: String(form.get("first_name") ?? ""),
        last_name: String(form.get("last_name") ?? ""),
        email: String(form.get("email") ?? ""),
        year: String(form.get("year") ?? ""),
        major: String(form.get("major") ?? ""),
        first_choice: String(form.get("first_choice") ?? ""),
        second_choice: String(form.get("second_choice") ?? ""),
        portfolio_url: String(form.get("portfolio_url") ?? ""),
        why_join: String(form.get("why_join") ?? ""),
        resume_path,
      });
      formRef.current.reset();
      setMessage("Your application was submitted. Thank you.");
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "Unable to submit this application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="apply" className="w-full scroll-mt-24 px-4 pb-20">
      <div className="container mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
        <h2 className="mb-2 font-outfit text-3xl font-bold uppercase text-white">
          Leadership Application
        </h2>
        <p className="mb-8 font-inter text-sm text-gray-400">
          Submit your leadership and department application below. Optional resumes must be a PDF up to 5 MB.
        </p>
        <form ref={formRef} className="space-y-4" onSubmit={submit}>
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              name="first_name"
              placeholder="First name"
              aria-label="First name"
              maxLength={100}
              className={inputClass}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last name"
              aria-label="Last name"
              maxLength={100}
              className={inputClass}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="GT email"
            aria-label="GT email"
            maxLength={254}
            className={inputClass}
            required
          />
          <div className="flex flex-col gap-4 sm:flex-row">
            <select name="year" aria-label="Year" defaultValue="" className={inputClass} required>
              <option value="" disabled>
                Year
              </option>
              {years.map((y) => (
                <option key={y} value={y} className="bg-deep-space">
                  {y}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="major"
              placeholder="Major"
              aria-label="Major"
              maxLength={200}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <select
              name="first_choice"
              aria-label="First choice department"
              defaultValue=""
              className={inputClass}
              required
            >
              <option value="" disabled>
                First choice department
              </option>
              {departments.map(({ name }) => (
                <option key={name} value={name} className="bg-deep-space">
                  {name}
                </option>
              ))}
            </select>
            <select
              name="second_choice"
              aria-label="Second choice (optional)"
              defaultValue=""
              className={inputClass}
            >
              <option value="">Second choice (optional)</option>
              {departments.map(({ name }) => (
                <option key={name} value={name} className="bg-deep-space">
                  {name}
                </option>
              ))}
            </select>
          </div>
          <input
            type="url"
            name="portfolio_url"
            placeholder="Portfolio / GitHub link (optional)"
            aria-label="Portfolio or GitHub link"
            maxLength={500}
            className={inputClass}
          />
          <label className="block font-inter text-sm text-gray-400">
            Resume (PDF, optional)
            <input
              type="file"
              name="resume"
              accept="application/pdf,.pdf"
              className={`${inputClass} mt-2 file:mr-4 file:rounded-full file:border-0 file:bg-tech-gold file:px-4 file:py-1 file:font-outfit file:text-xs file:font-bold file:text-white`}
            />
          </label>
          <textarea
            name="why_join"
            rows={4}
            placeholder="Why do you want to join?"
            aria-label="Why do you want to join?"
            maxLength={5000}
            className={inputClass}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-tech-gold py-3 font-outfit text-sm font-bold text-white transition-colors hover:bg-gold-glow disabled:cursor-not-allowed disabled:bg-tech-gold/50"
          >
            {submitting ? "Submitting..." : "Submit application"}
          </button>
          {message && (
            <p className={failed ? "font-inter text-sm text-red-300" : "font-inter text-sm text-gray-300"}>
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default RecruitmentForm;
