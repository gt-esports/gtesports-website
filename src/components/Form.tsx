"use client";

import type React from "react";
import { useRef } from "react";
import bee from "../assets/bee.png";
import emailjs from "@emailjs/browser";
import SocialBar from "./SocialBar";
import MobileSocialBar from "./MobileSocialBar";
import { Link } from "react-router-dom";

const Form: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    emailjs
      .sendForm("service_ekzxpve", "template_w62ubea", formRef.current, {
        publicKey: "Q5mgxWbpdtHv7BGbX",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          formRef.current?.reset(); // clears the form
        },
        (error: unknown) => {
          console.log("FAILED...", (error as { text?: string })?.text || error);
        }
      );
  };
  
  return (
    <FormOuter>
      <FormInner formRef={formRef} sendEmail={sendEmail} />
    </FormOuter>
  );
};

export const SubscribeForm: React.FC = () => {
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
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className="w-full rounded-md border-navy-blue bg-navy-blue p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            <p className="text-gray-400 text-sm">
              By filling out this form,  you agree to the terms & conditions in our <Link to="/privacy">Privacy Form</Link>
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

const FormInner = ({formRef, sendEmail} : {formRef: React.RefObject<HTMLFormElement>, sendEmail: (e: React.FormEvent) => void}) => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-gradient-to-b from-navy-blue to-tech-gold shadow-xl">
      {/* Main content container with improved mobile layout */}
      <div className="flex w-full flex-col p-6 sm:p-8 md:flex-row md:gap-8">
        {/* Form Section - Full width on mobile */}
        <div className="w-full font-quicksand md:w-1/2">
            <h2 className="mb-6 text-2xl font-bold text-white">GET IN TOUCH</h2>
            <form
              ref={formRef}
              onSubmit={sendEmail}
              className="space-y-4 text-white"
            >
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full rounded-md border-navy-blue bg-navy-blue p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="w-full rounded-md border-navy-blue bg-navy-blue p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <textarea
                name="message"
                placeholder="Go ahead, we are listening..."
                className="w-full rounded-md border-navy-blue bg-navy-blue p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                rows={4}
                required
              />
              <button
                type="submit"
                className="w-full rounded-md bg-bright-buzz py-3 font-bold text-white shadow-md transition-colors hover:bg-yellow-700 focus:outline-none"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Contact Info Section - Better mobile layout */}
          <div className="mt-8 flex w-full flex-col items-center md:mt-0 md:w-1/2">
            <div className="flex flex-col items-center">
              <img
                src={bee || "/placeholder.svg"}
                alt="Bee"
                className="h-32 w-32 object-contain sm:h-40 sm:w-40"
              />
              <div className="mt-6 space-y-3 text-white">
                <p className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                  <span className="font-semibold">Address:</span>
                  <span>801 Atlantic Dr NW, Atlanta, GA 30332</span>
                </p>
                <p className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                  <span className="font-semibold">Phone:</span>
                  <span>888-8888-8888</span>
                </p>
                <p className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                  <span className="font-semibold">Email:</span>
                  <span className="break-all">
                    georgiatechesports@gmail.com
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section - Fixed for desktop */}
        <div className="hidden md:mb-6 md:mt-4 md:block">
          <SocialBar />
        </div>

        {/* Mobile Social Bar */}
        <div className="flex justify-center p-4 md:hidden">
          <MobileSocialBar />
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

export default Form;