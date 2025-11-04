interface CarouselCardProps {
  image: string;
  name: string;
  link: string;
}

function CarouselCard(props: CarouselCardProps) {
  return (
    <div
      className={`align-center flex w-full max-w-[420px] flex-col items-center justify-center rounded-lg px-4 text-center duration-300 xs:px-6 sm:px-8 md:px-10`}
      style={{ overflow: 'visible' }}
    >
      <a href={props.link} target="blank" className="w-full" style={{ overflow: 'visible' }}>
        <img
          src={props.image}
          loading="lazy"
          className="w-full"
          style={{ 
            objectFit: 'contain',
            maxHeight: '490px',
            height: 'auto',
            display: 'block'
          }}
          alt={props.name}
        />
      </a>
      <p className="py-4 font-barlow font-semibold tracking-wide text-white">
        {props.name}
      </p>
    </div>
  );
}

export default CarouselCard;
