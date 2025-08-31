import { RecruitmentCardProps } from "../types";

export default function RecruitmentCard(props: RecruitmentCardProps) {
  console.log("description");
  console.log(props.description);
  return (
    <div className="flex w-3/5 flex-row items-center rounded-xl bg-gradient-to-br from-[#3d3d3d]/95 to-[#a7a7a7]/95 p-4">
      {/* game image */}
      <div className="border-0 md:p-4">
        <img
          src={props.image}
          alt={`${props.name}`}
          className="card-image hidden h-full rounded-2xl object-contain md:block md:w-64"
        />
      </div>
      {/* text info */}
      <div className="relative flex w-full flex-col items-center tracking-wider md:items-start md:pl-2">
        <h1 className="flex font-sans text-[0.97rem] font-semibold tracking-wide text-white md:place-self-end md:pr-2">
          Applications: {props.applicationStatus}
        </h1>
        <h1 className="pb-2 font-bayon text-[1.4rem] text-bright-buzz">
          {props.name}
        </h1>
        <p className="font-barlow text-[0.95rem] font-bold text-bright-buzz">
          Open Positions:
        </p>
        <p className="tracking pb-2 pl-3 font-barlow text-[0.9rem] font-light text-white">
          {props.recruitmentInfo}
        </p>
        <p className="font-barlow text-[0.95rem] font-bold text-bright-buzz">
          Description:
        </p>
        <p className="tracking pl-3 font-barlow text-[0.9rem] font-light text-white">
          {props.description}
        </p>
        <p className="pt-2 font-barlow text-[.95rem] font-bold text-bright-buzz">
          Contact:
        </p>
        <p className="tracking font-barlow text-[0.9rem] font-light text-white md:pl-3">
          • Email: {props.contactEmail}
        </p>
        <p className="tracking font-barlow text-[0.95rem] font-light text-white md:pl-3">
          • Discord: {props.contactDiscord}
        </p>
        {/* learn more button */}
        <button className="learn-more-btn mx-12 my-2 flex w-64 scale-x-[1.1] items-center justify-center self-end tracking-tighter md:mt-8">
          Learn More
        </button>
      </div>
    </div>
  );
}
