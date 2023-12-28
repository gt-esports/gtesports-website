interface NECardProps {
  image: string;
  name: string;
  time: string;
  link: string;
  location: string;
  type: boolean; // true for news, false for event
}

function NECard(props: NECardProps) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    window.location.href = (e.target as HTMLButtonElement).value;
  }

  return (
    <div className="mx-4 flex h-56 w-96 flex-row overflow-hidden rounded-2xl bg-necard text-white">
      <img src={props.image} className="w-50 h-full object-fill" />
      <div className="flex w-full flex-col items-center justify-center">
        <h2>{props.name}</h2>
        <p>{props.time}</p>
        <p>{props.location}</p>
        {props.type ? (
          <button
            className="mt-10 h-1/4 w-3/4 rounded-2xl bg-tech-gold"
            onClick={handleClick}
            value={props.link}
          >
            VIEW NOW
          </button>
        ) : (
          <button
            className="mt-8 h-1/4 w-3/4 rounded-2xl bg-tech-gold"
            onClick={handleClick}
            value={props.link}
          >
            REGISTER
          </button>
        )}
      </div>
    </div>
  );
}

export default NECard;
