import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-deep-space text-white font-inter">
            <ScrollToTop />
            <Navbar />
            <main className="flex-grow pt-[10vh]">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
