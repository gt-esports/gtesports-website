import type React from "react";
import { useState } from "react";
import { subscribeNewsletter } from "../lib/marketingContacts";

const inputClass =
  "w-full rounded-lg border border-white/15 bg-deep-space/80 px-4 py-3 text-white placeholder:text-gray-500 focus:border-tech-gold focus:outline-none focus:ring-1 focus:ring-tech-gold";

const SubscribeForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await subscribeNewsletter(email, name);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to subscribe. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full rounded-lg border border-white/10 bg-black/40 px-6 py-10 backdrop-blur-sm sm:px-10">
      <div className="mx-auto max-w-xl">
        <p className="mb-8 text-center font-quicksand text-lg text-gray-300">
          Join our mailing list for matches, events, and recruitment updates.
        </p>

        {submitted ? (
          <p className="text-center font-quicksand text-lg text-tech-gold">
            Thanks for subscribing{name.trim() ? `, ${name.trim()}` : ""}!
          </p>
        ) : (
          <form onSubmit={subscribe} className="space-y-4 font-quicksand">
            <div>
              <label htmlFor="newsletter-name" className="mb-2 block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                id="newsletter-name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                required
                maxLength={200}
                disabled={saving}
              />
            </div>
            <div>
              <label htmlFor="newsletter-email" className="mb-2 block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
                maxLength={254}
                disabled={saving}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="mt-2 w-full rounded-full bg-tech-gold py-3 font-bold uppercase tracking-wide text-deep-space shadow-lg transition-all duration-300 hover:bg-yellow-500 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubscribeForm;
