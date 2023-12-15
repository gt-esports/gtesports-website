interface CarouselCardProps {
  image: string;
<<<<<<< HEAD
  name: string;
  link: string;
  center: boolean;
=======
  link: string;
>>>>>>> 1f60b4b (start game carousel)
}

function CarouselCard(props: CarouselCardProps) {
  return (
<<<<<<< HEAD
    <div
      className={`h-full w-full pl-10 pr-10 text-center transition-transform duration-300 ${
        props.center ? "scale-100" : "scale-75"
      }`}
    >
      <a href={props.link}>
        <img src={props.image} className="h-full w-full object-cover" />
      </a>
      <p className="text-white">{props.name}</p>
=======
    <div>
      <img src={props.image} />
      <p>{props.link}</p>
>>>>>>> 1f60b4b (start game carousel)
    </div>
  );
}

export default CarouselCard;
