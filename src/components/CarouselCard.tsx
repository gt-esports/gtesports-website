interface CarouselCardProps {
  image: string;
  link: string;
}

function CarouselCard(props: CarouselCardProps) {
  return (
    <div>
      <img src={props.image} />
      <p>{props.link}</p>
    </div>
  );
}

export default CarouselCard;
