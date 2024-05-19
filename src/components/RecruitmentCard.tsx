import { RecruitmentCardProps } from "../types";

export default function RecruitmentCard(props: RecruitmentCardProps) {
  return (
    <div className=" items box-content flex w-9/12 flex-row rounded-xl bg-gradient-to-br from-[#3d3d3d]/95 to-[#a7a7a7]/95">
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
      <div className="box-content flex h-full w-full flex-col pl-1 pt-4 tracking-wider">
        <h1 className=" flex flex-row-reverse pr-8 font-sans text-[0.97rem] font-semibold tracking-wide text-white">
          Tryout date: {props.tryoutDate}
        </h1>
        <h1 className="pb-2 font-bayon text-[1.4rem] text-bright-buzz">
          {props.name}
        </h1>
        <p className=" font-barlow text-[0.95rem] text-bright-buzz">
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
        {/* button here */}
        {/* <a href={props.discordLink} target="_blank">
            <button className="discord-btn mr-3"></button>
          </a> */}
      </div>
      <div className="relative mb-3 pr-6 pt-8">
        <button className="learn-more-btn absolute bottom-0 right-6 ml-3 mr-4 mt-6 flex scale-90 scale-x-[1.2] items-center justify-center tracking-tighter">
          Learn More
        </button>
      </div>
    </div>
  );
}
