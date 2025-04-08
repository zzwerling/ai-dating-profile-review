import { useState } from "react";
import axios from "axios";

function BioForm() {
  const [bio, setBio] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Friendly & Simple"); 


  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false); 
  };

  const options = new Map([
    ["Friendly & Simple", 0],
    ["Balanced Mode", 0.35],
    ["Bold & Playful", 0.7],
    ["Freestyle Mode", 1.0]
  ])
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    setTemperature(options.get(selectedOption))

    try {
      const res = await axios.post("http://localhost:8000/review", {
        bio,
        temperature
      });

      setResponse(res.data);
    } catch (err) {
      alert("Error calling backend");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-xl p-6 sm:p-8 md:p-10">
<form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-black-800">Dating Bio Review 💘🤖</h2>
  
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="5"
          placeholder="Paste your dating bio here..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
  
        <div className="relative">
          <h3 className="text-xl font-semibold text-gray-700 mb-1">Critique Style</h3>
  
          <button
            onClick={toggleDropdown}
            className="w-full flex justify-between items-center bg-gray-100 text-gray-800 px-4 py-3 rounded-lg shadow-sm hover:bg-gray-200 transition"
            type="button"
          >
            {selectedOption || "Choose a style"}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
  
          {isDropdownOpen && (
            <ul className="absolute left-0 right-0 z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md">
              {Array.from(options.keys()).map((label) => (
                <li
                  key={label}
                  onClick={() => handleOptionSelect(label)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>
  
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </form>
  
      {response && (
        <div className="mt-10 border-t pt-6 space-y-4 text-sm text-gray-700">
          <div>
            <strong>Original Bio Rating:</strong> {response.submitted_rating}/10
          </div>
          <div>
            <strong>Critique:</strong> {response.submitted_critique}
          </div>
          <div>
            <strong>Rewritten Bio:</strong>
            <div className="bg-gray-50 border border-gray-200 p-3 mt-1 rounded">
              {response.rewritten_bio}
            </div>
          </div>
          <div>
            <strong>Rewritten Rating:</strong> {response.rewritten_rating}/10
          </div>
          <div>
            <strong>Why It's Better:</strong> {response.rewritten_explanation}
          </div>
        </div>
      )}
    </div>
  );
}

export default BioForm;
