import { EventCardProps } from "../types";

export default function EventCard(props: EventCardProps) {
  return (
    <div className="flex w-full h-full flex-row p-10 rounded-xl bg-gradient-to-br from-[#3d3d3d]/95 to-[#a7a7a7]/95">
      <div className="flex flex-col w-64 h-64 justify-center items-center gap-8">
        {/* name */}
        <div className="flex flex-row tracking-wider gap-16">
            <h1 className="font-bold text-bright-buzz font-bayon text-[1.4rem]">{props.name}</h1>
            <div className="flex flex-col pl-1 items-end">
                <p className="text-white tracking-wide font-sans text-[0.97rem] font-semibold">{props.date}</p>
                <p className="text-white tracking-wide font-sans text-[0.97rem] font-semibold">{props.time}</p>
            </div>
        </div>
        <p className="text-white font-barlow text-[0.9rem] font-light tracking">{props.description}</p>
        <button className="learn-more-btn flex items-center justify-center tracking-tighter whitespace-normal overflow-hidden text-ellipsis">
        Learn More
        </button>  
      </div>
    </div>
  );
}