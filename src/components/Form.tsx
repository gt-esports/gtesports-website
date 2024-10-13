// Form.tsx
import React, { useState } from 'react';
import bee from "../assets/bee.png";
const Form: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-transparent flex items-center justify-center">
      <div className="max-w-4xl w-full bg-gradient-to-b from-navy-blue to-tech-gold p-10 rounded-lg shadow-md flex">
        {/* Form Section */}
        <div className="flex-1 pr-10 font-quicksand">
          <h2 className="text-2xl font-bold text-tech-gold mb-8">GET IN TOUCH</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-100"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-100"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Go ahead, We are listening..."
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-100"
              rows={4}
            />
            <button
              type="submit"
              className="w-full py-3 bg-bright-buzz text-white rounded-md hover:bg-yellow-700 focus:outline-none"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Contact Info Section */}
        <div className="flex-1 flex flex-col items-start justify-center ml-10">
          <img src={bee} alt="Bee" className="w-48 h-48 mb-14" />
          <div className="text-white space-y-3">
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
      </div>
    </div>
  );
};

export default Form;
