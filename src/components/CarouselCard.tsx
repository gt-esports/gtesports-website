interface CarouselCardProps {
  image: string;
  name: string;
  link: string;
}

function CarouselCard(props: CarouselCardProps) {
  return (
    <div
      className={`align-center h-[490px] w-[420px] flex-col justify-center rounded-lg px-10 text-center
      duration-300`}
    >
      <a href={props.link} target="blank">
        <img
          src={props.image}
          loading="lazy"
          className="h-full w-full rounded-lg object-cover"
        />
      </a>
      <p className="py-4 font-barlow font-semibold tracking-wide text-white">
        {props.name}
      </p>
    </div>
  );
}

export default CarouselCard;
