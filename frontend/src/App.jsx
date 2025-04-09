import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BioReviewPage from "./pages/BioReviewPage";
import GenerateOpenerPage from "./pages/GenerateOpenerPage";
import ConvoCoachPage from "./pages/ConvoCoachPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/bio-review" element={<BioReviewPage />} />
        <Route path="/generate-openers" element={<GenerateOpenerPage />}/>
        <Route path="/convo-coach" element={<ConvoCoachPage />}/>
      </Routes>
    </Router>
  );
}

export default App;