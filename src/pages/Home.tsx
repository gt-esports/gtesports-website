function Home() {
  return (
    <div className="h-screen w-full">
      <div className="flex h-full w-full items-center justify-center bg-home-1 bg-cover ">
        <h1 className="font-bayon text-9xl font-normal text-tech-gold">
          G<span className="text-white">eorgi</span>a Tech{" "}
          <span className="text-white">Esports</span>
        </h1>
      </div>
      <div className="flex h-[200vh] w-full justify-center bg-streak bg-cover pt-24">
        <h2 className="font-bayon text-7xl font-normal text-white">
          CHOOSE YOUR GAME
        </h2>
      </div>
    </div>
  );
}

export default Home;
