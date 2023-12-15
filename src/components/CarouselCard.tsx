interface CarouselCardProps {
  image: string;
  name: string;
  link: string;
}

function CarouselCard(props: CarouselCardProps) {
  return (
    <div className="h-full w-full text-center ">
      <a href={props.link}>
        <img
          src={props.image}
          className="h-full w-full  object-cover pl-5 pr-5"
        />
      </a>
      <p className="text-white">{props.name}</p>
    </div>
  );
}

export default CarouselCard;
