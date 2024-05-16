interface CarouselCardProps {
  image: string;
  name: string;
  link: string;
  center: boolean;
}

function CarouselCard(props: CarouselCardProps) {
  return (
    <div
      className={`h-full w-full pl-10 pr-10 text-center transition-transform duration-300 ${
        props.center ? "scale-100" : "scale-75"
      }`}
    >
      <a href={props.link}>
        <img src={props.image} className="h-full w-full object-cover" />
      </a>
      <p className="py-4 font-barlow font-semibold tracking-wide text-white">
        {props.name}
      </p>
    </div>
  );
}

export default CarouselCard;
