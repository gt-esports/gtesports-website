import { NewsEventsProps } from "../types";

function NewsEventsCard(props: NewsEventsProps) {
  return (
    // <div className="card flex flex-col items-center">
    //   <div className="relative">
    //     <img
    //         src={props.image}
    //         alt={`${props.name}`}
    //         className="card-image h-[285px] w-[220px] rounded-2xl pb-2 pl-3 pr-3 pt-3"
    //     />
    //     <span className="absolute bottom-2 right-3 bg-black bg-opacity-50 px-2 py-1 text-sm text-white rounded">{props.date}
    //     </span>
    //   </div>
    //   <h1 className="pb-2 font-barlow text-xl text-white">{props.name}</h1>
    //   <h2 className="pb-2 font-barlow text-xl text-yellow">{props.author}</h2>
    //   {/* <div className="mb-3 flex w-full justify-between">
    //     <button className="learn-more-btn text-barlow ml-3 flex items-center justify-center">
    //       Learn More
    //     </button>
    //     <a href={props.discordLink} target="_blank">
    //       <button className="discord-btn mr-3"></button>
    //     </a>
    //   </div> */}
    // </div>
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

// export default NewsEventsCard;

// import { NewsEventsProps } from "../types";

// function NewsEventsCard(props: NewsEventsProps) {
//   return (
//     <div className="card flex flex-row items-start bg-transparent">
//       <div className="relative mr-4">
//         <img
//           src={props.image}
//           alt={`${props.name}`}
//           className="card-image h-[400px] w-[300px] rounded-lg object-cover"
//         />
//         <span className="absolute bottom-3 right-3 bg-blue-500 bg-opacity-70 px-2 py-1 text-sm text-white rounded">
//           {props.date}
//         </span>
//       </div>
//       <div className="flex flex-col">
//         <h1 className="pb-2 font-barlow text-2xl text-white">{props.name}</h1>
//         <h2 className="pb-2 font-barlow text-sm text-yellow-400">{props.author}</h2>
//       </div>
//     </div>
//   );
// }

export default NewsEventsCard;