import NewsEventsGrid from "../components/NewsEventsGrid";
import Footer from "../components/Footer";

function Games() {
  return (
    <div className="flex flex-col justify-center bg-streak bg-cover pt-36">
      <div className="flex items-center justify-center">
        <h1 className="justify-center font-bayon text-6xl text-white">NEWS & EVENTS</h1>
      </div>
      <div className="items-center pt-4">
        <NewsEventsGrid />
      </div>
      <Footer />
    </div>
  );
}

export default Games;
