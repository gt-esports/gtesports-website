import { RecruitmentCardProps } from "../types";

export default function RecruitmentCard(props: RecruitmentCardProps) {
  return (
    <div className="items flex w-9/12 flex-row rounded-xl bg-gradient-to-br from-[#3d3d3d]/95 to-[#a7a7a7]/95">
      <img
        src={props.image}
        alt={`${props.name}`}
        className="card-image m-2 h-[280px] w-[195px] rounded-2xl pb-2 pl-3 pr-3 pt-3"
      />

      {/* text info */}
      <div className="tracking-wid flex w-full flex-col pl-1 pt-4">
        <h1 className=" flex flex-row-reverse pr-8 font-barlow text-[0.95rem] font-semibold tracking-wide text-white">
          Tryout date: 8/27/2023
        </h1>
        <h1 className="pb-2 font-bayon text-[1.4rem] tracking-wider text-bright-buzz">
          {props.name}
        </h1>
        <p className=" font-barlow text-[0.95rem] tracking-wider text-bright-buzz">
          Recruitment Info:
        </p>
        <p className="tracking pl-3 font-barlow text-[0.9rem] font-light text-white">
          {props.recruitmentInfo}
        </p>
        <p className="pt-2 font-barlow text-[.95rem] tracking-wider text-bright-buzz">
          Contact:
        </p>
        <p className="tracking pl-3 font-barlow text-[0.9rem] font-light text-white">
          • email: {props.contactEmail}
        </p>
        <p className="tracking pl-3 font-barlow text-[0.95rem] font-light text-white">
          • discord: {props.contactDiscord}
        </p>
        {/* button here */}
        <div className="mb-3 flex flex-row-reverse pr-4 pt-8">
          <button className="learn-more-btn text-barlow ml-3 flex items-center justify-center tracking-wide">
            Learn More
          </button>
        </div>
        {/* <a href={props.discordLink} target="_blank">
            <button className="discord-btn mr-3"></button>
          </a> */}
      </div>
    </div>
  );
}
