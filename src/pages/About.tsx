import { useEffect } from "react";
import axios from "axios";

function About() {

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    console.log(response.data.about);
  };

  useEffect(() => {
    fetchAPI();
  }, []);
  return (
    <div className="h-screen w-full">
      <div className="flex h-full w-full bg-streak bg-cover text-white">
        <a>This is the about page.</a>
      </div>
    </div>
  );
}

export default About;
