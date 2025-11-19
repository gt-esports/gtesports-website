"use client";

import type React from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";

const SubscribeForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;
  };

  return (
    <FormOuter>
      <SubscribeInner formRef={formRef} subscribe={subscribe} />
    </FormOuter>
  );
};

const SubscribeInner = ({formRef, subscribe} : {formRef: React.RefObject<HTMLFormElement>, subscribe: (e: React.FormEvent) => void}) => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-gradient-to-b from-navy-blue to-tech-gold shadow-xl">
      {/* Main content container with improved mobile layout */}
      <div className="flex w-full flex-col p-6 sm:p-8 md:flex-row md:gap-8">
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
              className="w-full rounded-md border-navy-blue bg-navy-blue p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              />
              <input
                type="text"
                name="last-name"
                placeholder="Enter your last name"
                className="w-full rounded-md border-navy-blue bg-navy-blue p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className="w-full rounded-md border-navy-blue bg-navy-blue p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            <p className="text-gray-400 text-sm">
              By filling out this form, you agree to the terms & conditions in our <Link to="/privacy" className='hover:underline'>Privacy Form</Link>
            </p>
            <button
              type="submit"
              className="w-full rounded-md bg-tech-gold py-3 font-bold text-white shadow-md transition-colors hover:bg-tech-gold/[0.7] focus:outline-none"
            >
              Subscribe
            </button>
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