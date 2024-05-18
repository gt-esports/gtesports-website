import { RecruitmentCardProps } from "../types";

export default function RecruitmentCard(props: RecruitmentCardProps) {
  return (
    <div className="items flex w-9/12 flex-row rounded-xl bg-gradient-to-br from-[#3d3d3d]/90 to-[#a7a7a7]/90">
      <img
        src={props.image}
        alt={`${props.name}`}
        className="card-image m-2 h-[260px] w-[195px] rounded-2xl pb-2 pl-3 pr-3 pt-3"
      />
      <div className="flex flex-col pt-4 tracking-wide">
        <h1 className="pb-3 pt-6 font-bayon text-[1.4rem] tracking-wider text-bright-buzz">
          {props.name}
        </h1>
        <p className="pt-2 font-barlow text-[1.1rem] tracking-wider text-bright-buzz">
          Recruitment Info:
        </p>
        <p className="tracking pl-3 font-barlow text-[0.95rem] font-light text-white">
          {props.recruitmentInfo}
        </p>

        <p className="pt-2 font-barlow text-[1.05rem] tracking-wider text-bright-buzz">
          Contact:
        </p>

        <p className="tracking pl-3 font-barlow text-[0.95rem] font-light text-white">
          • email: {props.contactEmail}
        </p>

        <p className="tracking pl-3 font-barlow text-[0.95rem] font-light text-white">
          • discord: {props.contactDiscord}
        </p>
      </div>
    </div>
  );
}
