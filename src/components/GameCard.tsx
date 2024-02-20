import { GameCardProps } from "../types"

function GameCard(props: GameCardProps) {
    return (
        <div className="card flex flex-col items-center">
            <img 
            src={props.image} alt={`${props.name}`} 
            className="card-image w-[225px] h-[295px] pt-3 pb-2 pr-3 pl-3 rounded-2xl"
            />
            <h1 className="text-white font-barlow text-lg pb-2">{props.name}</h1>
            <div className="flex justify-between w-full mb-3">
                <button className="learn-more-btn text-barlow flex justify-center items-center ml-3">Learn More</button>
                <button className="discord-btn mr-3"></button>
            </div>
        </div>
    )
}

export default GameCard;