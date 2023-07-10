import Navbar from "./components/Navbar";

function App() {
    return (
        <>
            <Navbar />
            <main className="bg-white w-full h-screen mt-[--navbar-height]">
                <h1 className={"text-3xl text-black"}>GTEsports Website</h1>
            </main>
        </>
    );
}

export default App;
