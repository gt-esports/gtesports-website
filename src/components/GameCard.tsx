import learnMoreButton from "../assets/learn-more-button.png"
import discordButton from "../assets/discord-button.png"

interface GameCardProps {
    image: string;
    name: string;
    discordLink: string;
    link: string;
}

function GameCard(props: GameCardProps) {
    return (
        <div className="card flex flex-col items-center">
            <img 
            src={props.image} alt={`${props.name}`} 
            className="card-image w-full pt-3 pb-2 pr-3 pl-3"
            />
            <h1 className="text-white font-barlow text-lg pb-2">{props.name}</h1>
            <div className="flex justify-between w-full">
                <img src={learnMoreButton} alt="" className="pb-3 pl-3"/>
                <img src={discordButton} alt="" className="pb-3 pr-3"/>
            </div>
        </div>
        // <img src={props.image} alt={`${props.name}`} />
    )
}

export default GameCard;