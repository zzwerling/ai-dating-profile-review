import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BioReviewPage from "./pages/BioReviewPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/bio-review" element={<BioReviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;