import Footer from "../components/Footer";
import { eventsData }  from "../data/eventsData";
import EventCard from "../components/EventCard";

function NewsAndEvents() {
  return (
    <div className="h-full w-full bg-streak bg-cover pt-16">
      <div className="flex flex-col pt-20 text-white">
        <h1 className="flex justify-center font-bayon text-6xl text-white">
            EVENTS AND NEWS
        </h1>
      </div>
      <div className="flex flex-wrap flex-row pt-8 items-center justify-center">
        {Object.entries(eventsData).map(([name, event], index) => (
          <div className="m-6 place-items-center">
            <EventCard
              key={index}
              name={name}
              date={event.date}
              time={event.time}
              description={event.description}
              link={event.link}
            />
          </div>    
        ))}
      </div>
      <div className="mt-36">
        <Footer />
      </div>
    </div>
  );
}

export default NewsAndEvents;
