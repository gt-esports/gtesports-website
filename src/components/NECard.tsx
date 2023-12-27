interface NECardProps {
  image: string;
  name: string;
  time: string;
  link: string;
}

function NECard(props: NECardProps) {
  function handleClick() {
    window.location.href = props.link;
  }

  return (
    <div className="mx-4 flex h-56 w-80 flex-row overflow-hidden rounded-2xl bg-white">
      <img src={props.image} className="w-50 h-full object-fill" />
      <div className="flex w-full flex-col items-center justify-center">
        <h2>{props.name}</h2>
        <p>{props.time}</p>
        <button className="mt-10" onClick={handleClick} value={props.link}>
          View More
        </button>
      </div>
    </div>
  );
}

export default NECard;
