import { useEffect } from "react";
import { TfiClose } from "react-icons/tfi"; 

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameName: string;
  gameDescription: string;
}

function GameModal({ isOpen, onClose, gameName, gameDescription }: GameModalProps) {
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
        
      </div>
    </div>
  );
}

export default GameModal;