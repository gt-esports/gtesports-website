import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <main className="mt-[--navbar-height] h-screen w-full bg-white">
        <h1 className={"text-3xl text-black"}>GTEsports Website</h1>
      </main>
    </>
  );
}

export default App;
