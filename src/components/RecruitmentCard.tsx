import { RecruitmentCardProps } from "../types";

export default function RecruitmentCard(props: RecruitmentCardProps) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex items-center w-max h-full flex-row p-4 rounded-xl bg-gradient-to-br from-[#3d3d3d]/95 to-[#a7a7a7]/95">
        {/* game image */}
        <div className="border-0 p-4">
          <img
            src={props.image}
            alt={`${props.name}`}
            className="hidden md:block card-image md:w-64 h-full rounded-2xl object-contain"
          />
        </div>
        <div className="flex-col w-full h-full">
          {/* text info */}
          <div className="flex flex-col pl-1 tracking-wider">
            <h1 className="flex flex-row-reverse pr-2 font-sans text-[0.97rem] font-semibold tracking-wide text-white">
              Tryout date: {props.tryoutDate}
            </h1>
            <h1 className="pb-2 font-bayon text-[1.4rem] text-bright-buzz">
              {props.name}
            </h1>
            <p className="font-barlow text-[0.95rem] text-bright-buzz">
              Recruitment Info:
            </p>
            <p className="tracking pl-3 font-barlow text-[0.9rem] font-light text-white">
              {props.recruitmentInfo}
            </p>
              <p className="pt-2 font-barlow text-[.95rem] text-bright-buzz">
                Contact:
              </p>
            <p className="tracking pl-3 font-barlow text-[0.9rem] font-light text-white">
              • email: {props.contactEmail}
            </p>
            <p className="tracking pl-3 font-barlow text-[0.95rem] font-light text-white">
              • discord: {props.contactDiscord}
            </p>  
          </div>
          {/* learn more button */}
          <div className="flex justify-center pt-12">
            <button className="learn-more-btn flex scale-x-[1.1] md:w-72 ml-24 mr-24 items-center justify-center tracking-tighter">
              Learn More
            </button>  
          </div>
        </div>
      </div>
    </div>
  );
}
