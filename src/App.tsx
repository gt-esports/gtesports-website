import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Games from "./pages/Games";

function App() {
  return (
    <>
      <Navbar />
      <main className="mt-[--navbar-height]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/games" element={<Games />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
