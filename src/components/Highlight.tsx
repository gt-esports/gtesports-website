function Highlight(url : string, play: boolean) {
    return <video src={url} autoPlay={play}></video>;
}

export default Highlight;