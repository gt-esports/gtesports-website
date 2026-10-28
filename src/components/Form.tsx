import type React from "react";
import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function SubscribeForm() {
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

    setSubmitting(true);
    setMessage(null);
    setFailed(false);

    try {
      const { error } = await supabase.rpc("subscribe_newsletter", {
        subscriber_email: email,
        subscriber_name: `${first} ${last}`,
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

  const inputClass = "mt-2 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-tech-gold";

  return (
    <section aria-labelledby={`${id}-title`} className="w-full overflow-hidden rounded-2xl border border-tech-gold bg-slate-100 shadow-[0_16px_60px_rgba(0,0,0,0.3)]">
      <div className="h-2 bg-tech-gold" />
      <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-2 md:gap-12">
        <div>
          <p className="mb-3 font-outfit text-xs font-bold uppercase tracking-[0.2em] text-slate-600">GT Esports • Stay connected</p>
          <h2 id={`${id}-title`} className="font-outfit text-3xl font-bold leading-tight text-deep-space sm:text-4xl">Subscribe to our Email Newsletter</h2>
          <p className="mt-4 font-inter leading-relaxed text-slate-600">Get the latest on matches, community events, and recruitment.</p>
        </div>
        <form ref={formRef} onSubmit={(event) => { void subscribe(event); }}>
          <fieldset disabled={submitting} className="min-w-0 space-y-4">
            <legend className="sr-only">Newsletter signup</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-800" htmlFor={`${id}-first`}>First name
                <input id={`${id}-first`} type="text" name="first-name" autoComplete="given-name" placeholder="First name" className={inputClass} required />
              </label>
              <label className="block text-sm font-semibold text-slate-800" htmlFor={`${id}-last`}>Last name
                <input id={`${id}-last`} type="text" name="last-name" autoComplete="family-name" placeholder="Last name" className={inputClass} required />
              </label>
            </div>
            <label className="block text-sm font-semibold text-slate-800" htmlFor={`${id}-email`}>Email address
              <input id={`${id}-email`} type="email" name="email" autoComplete="email" placeholder="you@example.com" className={inputClass} required />
            </label>
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input type="checkbox" name="agree" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} required className="mt-1 h-4 w-4 shrink-0 accent-tech-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900" />
              <span>I agree to receive the GT Esports newsletter.</span>
            </label>
            <button type="submit" disabled={!agreed || submitting} className="w-full rounded-lg bg-tech-gold px-5 py-3 font-outfit font-bold text-deep-space transition-colors hover:bg-gold-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Subscribing..." : "Subscribe"}</button>
          </fieldset>
          {message && <p role={failed ? "alert" : "status"} className={`mt-4 text-sm ${failed ? "text-red-800" : "text-slate-800"}`}>{message}</p>}
          <p className="mt-4 text-sm text-slate-600">Read how we handle your information in our <Link to="/privacy" className="rounded-sm font-medium text-slate-900 underline underline-offset-4 hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900">Privacy Policy</Link>.</p>
        </form>
      </div>
    </section>
  );
}

export default SubscribeForm;
