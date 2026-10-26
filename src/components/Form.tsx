"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const SubscribeForm: React.FC = () => {
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

    const { error } = await supabase.rpc("subscribe_newsletter", {
      subscriber_email: email,
      subscriber_name: `${first} ${last}`,
    });

    setSubmitting(false);
    if (error) {
      setFailed(true);
      setMessage("Unable to subscribe right now. Please try again.");
      return;
    }

    formRef.current.reset();
    setAgreed(false);
    setMessage("You're subscribed. Thanks for signing up.");
  };

  return (
    <FormOuter>
      <SubscribeInner
        formRef={formRef}
        subscribe={(event) => { void subscribe(event); }}
        submitting={submitting}
        agreed={agreed}
        setAgreed={setAgreed}
        message={message}
        failed={failed}
      />
    </FormOuter>
  );
};

const inputClass =
  "w-full rounded-md border border-white/20 bg-deep-space p-3 text-white placeholder-gray-400 caret-white focus:outline-none focus:ring-2 focus:ring-yellow-400";

const SubscribeInner = ({
  formRef,
  subscribe,
  submitting,
  agreed,
  setAgreed,
  message,
  failed,
}: {
  formRef: React.RefObject<HTMLFormElement>;
  subscribe: (e: React.FormEvent) => void;
  submitting: boolean;
  agreed: boolean;
  setAgreed: (value: boolean) => void;
  message: string | null;
  failed: boolean;
}) => {
  return (
    <div className="relative w-full">
      {/* Main content container with improved mobile layout */}
      <div className="flex w-full flex-col md:flex-row md:gap-8">
        {/* Form Section - Full width on mobile */}
        <div className="w-full font-quicksand">
          <h2 className="mb-6 text-2xl font-bold text-white">Subscribe to our Email Newsletter</h2>
          <form
            ref={formRef}
            onSubmit={subscribe}
            className="space-y-4 text-white"
          >
            <div className="flex w-full gap-4">
              <input
              type="text"
              name="first-name"
              placeholder="Enter your first name"
              className={inputClass}
              required
              />
              <input
                type="text"
                name="last-name"
                placeholder="Enter your last name"
                className={inputClass}
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className={inputClass}
              required
            />
            <label className="flex items-start gap-3 text-sm text-gray-200">
              <input
                type="checkbox"
                name="agree"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                required
                className="mt-1 h-4 w-4 shrink-0 accent-tech-gold"
              />
              <span>
                I agree to receive the newsletter and to the terms & conditions in our <Link to="/privacy">Privacy Form</Link>
              </span>
            </label>
            <button
              type="submit"
              disabled={!agreed || submitting}
              className="w-full rounded-md bg-tech-gold py-3 font-bold text-white shadow-md transition-colors hover:bg-tech-gold/[0.7] focus:outline-none disabled:cursor-not-allowed disabled:bg-tech-gold/30 disabled:text-white/50 disabled:hover:bg-tech-gold/30"
            >
              {submitting ? "Subscribing..." : "Subscribe"}
            </button>
            {message && (
              <p className={failed ? "text-sm text-red-200" : "text-sm text-white"}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

const FormOuter: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex w-full items-center justify-center px-4 sm:px-0">
      {children}
    </div>
  );
};

export default SubscribeForm;
