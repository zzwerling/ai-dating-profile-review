import BioForm from "./components/BioForm";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="w-full flex justify-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2">
          AI-Powered Dating Profile Assistant 💘🤖
        </h2>
      </div>

      <div className="flex items-center justify-center">
        <BioForm />
      </div>
    </div>
  );
}

export default App;
