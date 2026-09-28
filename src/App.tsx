import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import Games from "./pages/Games";
import Recruitment from "./pages/Recruitment";
import NewsAndEvents from "./pages/NewsAndEvents";
import About from "./pages/About";
import Teams from "./pages/Teams";
import OurTeam from "./pages/OurTeam";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";

// Analytics
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <Analytics />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/newsandevents" element={<NewsAndEvents />} />
          <Route path="/about" element={<About />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/ourteam" element={<OurTeam />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
