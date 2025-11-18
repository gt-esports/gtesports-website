import { useEffect } from "react";
import { TfiClose } from "react-icons/tfi";
import Highlight from "./Highlight.tsx";

interface GameModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameName: string;
    gameDescription: string;
    highlightLink?: string;
}

function GameModal({ isOpen, onClose, gameName, gameDescription, highlightLink }: GameModalProps) {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            onClose();
        }
        };

        if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
        }

        return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h2 className="modal-title">{gameName}</h2>
                <button className="modal-close-btn" onClick={onClose}>
                    <TfiClose size={20} />
                </button>
            </div>

            <div className="modal-body">
                <p className="modal-description">{gameDescription}</p>
            </div>

            {highlightLink && (
                <Highlight
                    src={highlightLink}
                    poster=""
                    captions={[]}
                    isOpen={true}
                    autoPlay={true}
                    className='px-6 pb-6'
                />
            )}
        </div>
        </div>
    );
}

export default GameModal;
