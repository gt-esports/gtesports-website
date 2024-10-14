import NewsEventsCard from "./NewsEventsCard";
import { news, events } from "../data/newsAndEventsData";
import { useState } from "react";

function NewsEventsGrid() {
  const [comp, setComp] = useState(true);

  return (
    <div className="flex flex-wrap justify-center px-[100px]">
      <div className="xl:right:24 flex justify-center w-full pb-4 font-barlow text-xl 2xl:left-56">
        <button
          className={
            comp
              ? "px-2 text-bright-buzz underline underline-offset-8"
              : "px-2 text-white underline-offset-4 duration-500 hover:text-bright-buzz"
          }
          onClick={() => setComp(true)}
        >
          News
        </button>
        <button
          className={
            !comp
              ? "px-2 text-bright-buzz underline underline-offset-8"
              : "px-2 text-white underline-offset-4 duration-500 hover:text-bright-buzz"
          }
          onClick={() => setComp(false)}
        >
          Events
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center">
        {Object.entries(comp ? news : events).map(
          ([name, news], index) => (
            <div className="p-3">
              <NewsEventsCard
                key={index}
                image={news.image}
                name={name}
                author={news.author}
                date={news.date}
                link={news.link}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default NewsEventsGrid;
