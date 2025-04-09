import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow-md">
  <div className="flex items-center space-x-8 max-w-6xl mx-auto">
    <Link to="/" className="text-xl font-bold hover:text-gray-200">
      AI-Powered Dating Profile Assistant
    </Link>
    <div className="flex space-x-4 text-sm">
      <Link to="/" className="hover:underline hover:text-gray-200">
        Home
      </Link>
    </div>
    <div className="flex space-x-4 text-sm">
      <Link to="/bio-review" className="hover:underline hover:text-gray-200">
        Bio Review
      </Link>
    </div>
    <div className="flex space-x-4 text-sm">
      <Link to="/generate-openers" className="hover:underline hover:text-gray-200">
        Generate Opener
      </Link>
    </div>
    <div className="flex space-x-4 text-sm">
      <Link to="/convo-coach" className="hover:underline hover:text-gray-200">
        Conversation Coach
      </Link>
    </div>
  </div>
</nav>
  );
}

export default NavBar;