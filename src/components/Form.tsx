import type React from "react";
import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaTrophy, FaUserPlus } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import { referralSources } from "../data/referralSources";

const perks = [
  { icon: FaTrophy, text: "Match results and team news" },
  { icon: FaCalendarAlt, text: "Community events and LAN parties" },
  { icon: FaUserPlus, text: "Recruitment and leadership openings" },
];

interface SubscribeFormProps {
  /** "section" is the full card used on the Home and About pages; "modal" is just the form, for NewsletterModal. */
  variant?: "section" | "modal";
}

function SubscribeForm({ variant = "section" }: SubscribeFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current || submitting || !agreed) return;

    const form = new FormData(formRef.current);
    const first = String(form.get("first-name") ?? "").trim();
    const last = String(form.get("last-name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const referralSource = String(form.get("referral-source") ?? "");

    setSubmitting(true);
    setMessage(null);
    setFailed(false);

    try {
      const { error } = await supabase.rpc("subscribe_newsletter", {
        subscriber_email: email,
        subscriber_name: `${first} ${last}`,
        subscriber_referral_source: referralSource || null,
      });
      if (error) throw error;

      formRef.current?.reset();
      setAgreed(false);
      setMessage("You're subscribed. Thanks for signing up.");
    } catch {
      setFailed(true);
      setMessage("Unable to subscribe right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const labelClass = "block text-sm font-semibold text-gray-200";
  const inputClass = "mt-2 w-full min-w-0 rounded-lg border border-white/15 bg-black/40 px-4 py-3 font-normal text-white placeholder:text-gray-500 transition-colors hover:border-white/30 focus:border-tech-gold focus:outline-none focus:ring-2 focus:ring-tech-gold/40 disabled:cursor-not-allowed disabled:opacity-60";

  const formFields = (
    <form ref={formRef} onSubmit={(event) => { void subscribe(event); }} className="min-w-0">
      <fieldset disabled={submitting} className="min-w-0 space-y-4">
        <legend className="sr-only">Newsletter signup</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass} htmlFor={`${id}-first`}>First name
            <input id={`${id}-first`} type="text" name="first-name" autoComplete="given-name" placeholder="First name" className={inputClass} required />
          </label>
          <label className={labelClass} htmlFor={`${id}-last`}>Last name
            <input id={`${id}-last`} type="text" name="last-name" autoComplete="family-name" placeholder="Last name" className={inputClass} required />
          </label>
        </div>
        <label className={labelClass} htmlFor={`${id}-email`}>Email address
          <input id={`${id}-email`} type="email" name="email" autoComplete="email" placeholder="you@example.com" className={inputClass} required />
        </label>
        <label className={labelClass} htmlFor={`${id}-referral`}>How did you hear about GT Esports? <span className="font-normal text-gray-400">(optional)</span>
          <select id={`${id}-referral`} name="referral-source" defaultValue="" className={`${inputClass} [&>option]:bg-deep-space`}>
            <option value="">Select an option</option>
            {referralSources.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label className="flex items-start gap-3 pt-1 text-sm text-gray-300">
          <input type="checkbox" name="agree" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} required className="mt-0.5 h-4 w-4 shrink-0 accent-tech-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tech-gold" />
          <span>I agree to receive the GT Esports newsletter.</span>
        </label>
        <button type="submit" disabled={!agreed || submitting} className="w-full rounded-full bg-tech-gold px-5 py-3 font-outfit font-bold tracking-wide text-deep-space transition-colors hover:bg-gold-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tech-gold disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "SUBSCRIBING..." : "SUBSCRIBE"}</button>
      </fieldset>
      {message && <p role={failed ? "alert" : "status"} className={`mt-4 text-sm font-medium ${failed ? "text-red-300" : "text-emerald-300"}`}>{message}</p>}
      <p className="mt-4 text-xs text-gray-400">Read how we handle your information in our <Link to="/privacy" className="rounded-sm font-medium text-gray-200 underline underline-offset-4 hover:text-tech-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tech-gold">Privacy Policy</Link>.</p>
    </form>
  );

  if (variant === "modal") return formFields;

  return (
    <section aria-labelledby={`${id}-title`} className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_16px_60px_rgba(0,0,0,0.4)]">
      <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-tech-gold/10 blur-3xl" />
      <div className="relative grid gap-10 p-6 sm:p-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12">
        <div className="flex flex-col">
          <p className="mb-3 font-outfit text-xs font-bold uppercase tracking-[0.2em] text-tech-gold">Stay connected</p>
          <h2 id={`${id}-title`} className="font-outfit text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">Get the GT Esports <span className="text-tech-gold">newsletter</span></h2>
          <p className="mt-4 font-inter leading-relaxed text-gray-400">News from our teams and community, sent to your inbox.</p>
          <ul className="mt-8 hidden space-y-4 md:block">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-gray-300">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tech-gold/15 text-tech-gold"><Icon aria-hidden="true" /></span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        {formFields}
      </div>
    </section>
  );
}

export default SubscribeForm;