import { useEffect, useRef } from "react";
import { HighlightProps} from "../types";


function Highlight({ src, poster, captions, controls = true, isOpen, autoPlay = true, className }: HighlightProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) {
            return;
        }
        if (!isOpen) {
            videoElement.pause();
            videoElement.currentTime = 0;
        }
        return () => {
            videoElement.pause();
            videoElement.currentTime = 0;
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className={className ?? "w-full"}>
            <video
                ref={videoRef}
                controls={controls}
                preload="metadata"
                poster={poster}
                className="aspect-video h-auto w-full rounded-xl object-contain"
                autoPlay={autoPlay}
            >
                <source src={src} type="video/mp4" />
                {/* TODO : Add captions support */}
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
export default Highlight;