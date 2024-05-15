import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Games from "./pages/Games";
import Recruitment from "./pages/Recruitment";
import NewsAndEvents from "./pages/NewsAndEvents";
import About from "./pages/About";
import Teams from "./pages/Teams";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/newsandevents" element={<NewsAndEvents />} />
          <Route path="/about" element={<About />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
