import { useState } from "react";
import axios from "axios";

function OpenerForm() {
  const [bio, setBio] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState(3);
  const [openers, setOpeners] = useState([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState("Friendly & Casual");


  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleOptionSelect = (option) => {
    setSelectedTone(option);
    setIsDropdownOpen(false);
  };

  const toneMap = new Map([
    ["Friendly & Casual", "friendly-casual"],
    ["Witty & Playful", "witty-playful"],
    ["Flirtatious", "flirtatious"],
    ["Bold & Direct", "bold-direct"],
    ["Compliment-Heavy", "compliment-heavy"],
    ["Quirky & Weird", "quirky-weird"]
  ]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);


    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/generate-openers`, {
        description: bio,
        tone: toneMap.get(selectedTone),
        number: number
      });

      setOpeners(res.data.openers);
    } catch (err) {
      alert("Error calling backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-xl p-6 sm:p-8 md:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-black-800">Generate Openers </h2>
        <hr></hr>
        <h3 className="text-xl font-semibold text-gray-700 mb-1">Bio</h3>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="5"
          placeholder="Paste their dating profile bio (or a description of their profile) here"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={500}
          required
        />

        <div className="relative">
          <h3 className="text-xl font-semibold text-gray-700 mb-1">Tone</h3>

          <button
            onClick={toggleDropdown}
            className="w-full flex justify-between items-center bg-gray-100 text-gray-800 px-4 py-3 rounded-lg shadow-sm hover:bg-gray-200 transition"
            type="button"
          >
            {selectedTone || "Choose a style"}
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
              {Array.from(toneMap.keys()).map((label) => (
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Openers
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Generating openers..." : "Submit"}
        </button>
      </form>

      {openers.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Your Openers:</h3>
          <ol className="list-decimal list-inside space-y-2">
            {openers.map((line, index) => (
              <li
                key={index}
                className="bg-gray-100 p-2 rounded shadow-sm"
              >
                {line}
              </li>
            ))}
          </ol>
        </div>
      )}

     
    </div>
  );
}

export default OpenerForm;
