import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import Games from "./pages/Games";
import Recruitment from "./pages/Recruitment";
import News from "./pages/News";
import About from "./pages/About";
import Teams from "./pages/Teams";
import OurTeam from "./pages/OurTeam";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Admin from "./pages/Admin";
import AdminAccessPage from "./pages/AdminAccess";
import MarketingContactsPage from "./pages/MarketingContacts";
import RequireAdmin from "./components/RequireAdmin";
import NewsArticle from "./pages/NewsArticle";

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
          <Route path="/join-us" element={<Recruitment />} />
          <Route path="/recruitment" element={<Navigate to="/join-us" replace />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsArticle />} />
          <Route path="/about" element={<About />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leadership" element={<OurTeam />} />
          <Route path="/ourteam" element={<Navigate to="/leadership" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<Admin />}>
              <Route path="access" element={<AdminAccessPage />} />
              <Route path="contacts" element={<MarketingContactsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
