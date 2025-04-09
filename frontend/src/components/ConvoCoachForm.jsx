import { useState } from "react";
import axios from "axios";

function ConvoCoachForm() {
  const [bio, setBio] = useState("");
  const [conversation, setConversation] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);


    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/conversation-feedback`, {
        conversation,
        bio
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
        <h2 className="text-2xl font-bold text-black-800">Dating Conversation Coach</h2>
        <hr></hr>
        <h3 className="text-xl font-semibold text-gray-700 mb-1">Bio</h3>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="5"
          placeholder="Paste their dating bio here..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={500}
          required
        />

<h3 className="text-xl font-semibold text-gray-700 mb-1">Conversation</h3>

        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="5"
          id="convo_box"
          placeholder="Paste the conversation here -- Her: Hey, how are you? -- Me: I'm good, what about you?"
          value={conversation}
          onChange={(e) => setConversation(e.target.value)}
          maxLength={1500}
          required
        />

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
            <strong>Summary:</strong> {response.feedback?.summary || 'No summary available.'}
          </div>

          <div>
            <strong>Tone Detected:</strong> {response.feedback?.tone_detected || 'No tone detected.'}
          </div>

          {response.suggestions?.length > 0 && (
            <div>
              <strong>Suggestions:</strong>
              <ul className="mt-2 space-y-2">
                {response.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="bg-gray-50 border border-gray-200 p-3 rounded"
                  >
                    <div className="font-medium capitalize">
                      Style: {suggestion.style}
                    </div>
                    <div>{suggestion.message}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {response.suggestions?.length === 0 && (
            <div>
              <strong>No suggestions:</strong> You spoke last, so just feedback is shown.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ConvoCoachForm;
