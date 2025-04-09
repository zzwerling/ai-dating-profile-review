import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Dating Toolkit 💘🤖</h1>
      <p className="text-gray-700 text-lg mb-8">
        Choose a tool to get started.
      </p>
    </div>
    </div>
  );
}

export default LandingPage;
