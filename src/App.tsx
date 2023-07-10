import Navbar from "./components/Navbar";

function App() {
    return (
        <>
            <Navbar />
            <main className="bg-indigo-600 w-full h-screen mt-[--navbar-height]">
                <h1 className={"text-3xl text-white"}>GTEsports Website</h1>
            </main>
        </>
    );
}

export default App;
