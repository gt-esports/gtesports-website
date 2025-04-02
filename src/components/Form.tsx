import React, { useRef } from "react";
import bee from "../assets/bee.png";
import emailjs from "@emailjs/browser";
import SocialBar from "./SocialBar";

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
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    <div className="flex items-center justify-center bg-transparent">
      <div className="relative flex w-full max-w-4xl flex-col gap-8 rounded-lg bg-gradient-to-b from-navy-blue to-tech-gold p-10 shadow-md sm:flex-row">
        {/* Form Section */}
        <div className="flex-1 pr-10 font-quicksand">
          <h2 className="mb-8 text-2xl font-bold text-tech-gold">
            GET IN TOUCH
          </h2>
          <form
            ref={formRef}
            onSubmit={sendEmail}
            className="space-y-4 text-black"
          >
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="w-full rounded-md border bg-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className="w-full rounded-md border bg-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            <textarea
              name="message"
              placeholder="Go ahead, we are listening..."
              className="w-full rounded-md border bg-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              rows={4}
              required
            />
            <button
              type="submit"
              className="w-full rounded-md bg-bright-buzz py-3 text-white hover:bg-yellow-700 focus:outline-none"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Contact Info Section */}
        <div className="flex flex-1 items-center justify-center gap-8 sm:flex-col sm:gap-0">
          <img src={bee} alt="Bee" className="mb-4 h-48 w-48 sm:mb-10" />
          <div className="space-y-3 text-white">
            <p className="flex items-center space-x-2">
              <span className="material-icons">Address:</span>
              <span>801 Atlantic Dr NW, Atlanta, GA 30332</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="material-icons">phone</span>
              <span>888-8888-8888</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="material-icons">email</span>
              <span>georgiatechesports@gmail.com</span>
            </p>
          </div>
        </div>

        {/* Social Media Section */}
        <SocialBar />
      </div>
    </div>
  );
};

export default Form;
