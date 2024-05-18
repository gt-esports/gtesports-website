import { RecruitmentCardProps } from "../types";

export default function RecruitmentCard(props: RecruitmentCardProps) {
  return (
    <div className=" flex w-9/12 flex-row rounded-xl bg-gradient-to-br from-[#3d3d3d]/95 to-[#a7a7a7]/95">
      {/* game image + discord icon */}
      <div className="relative box-content h-[280px] w-[225px] border-0 p-4">
        <img
          src={props.image}
          alt={`${props.name}`}
          className="card-image h-full w-full rounded-2xl "
        />
        <div className="absolute right-4 top-4 box-content flex h-16 w-16 items-center justify-center rounded-md bg-footer-shadow">
          <a href={props.discordLink} target="_blank">
            <button className="discord-btn opacity-7 m-4 h-[37px] w-[37px]"></button>
          </a>
        </div>
      </div>
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
        <div className="mb-3 flex flex-row-reverse pr-6 pt-8">
          <button className="learn-more-btn ml-3 mr-4 mt-6 flex scale-90 scale-x-[1.2] items-center justify-center tracking-tighter">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
