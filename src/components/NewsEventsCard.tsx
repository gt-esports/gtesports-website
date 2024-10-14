import { NewsEventsProps } from "../types";

function NewsEventsCard(props: NewsEventsProps) {
  return (
    <div className="newseventscard flex flex-col items-center bg-transparent p-4">
      <div className="relative mb-4">
        <img
          src={props.image}
          alt={`${props.name}`}
          className="newseventscard-image h-[200px] w-[400px] rounded-lg object-cover"
        />
        <span className="absolute bottom-3 right-3 bg-blue-500 bg-opacity-70 px-2 py-1 text-sm text-white rounded">
          {props.date}
        </span>
      </div>
      <div className="flex flex-col items-start w-full">
        <h1 className="pb-2 font-barlow text-2xl text-white">{props.name}</h1>
        <h2 className="pb-2 font-barlow text-sm text-yellow-400">
          {"Written by " + props.author}
        </h2>
      </div>
    </div>
  );
}
export default NewsEventsCard;