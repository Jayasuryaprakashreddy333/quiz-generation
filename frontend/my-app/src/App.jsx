import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import GenerateQuizTab from "./tabs/GenerateQuizTab.jsx";
import HistoryTab from "./tabs/HistoryTab.jsx"; 


export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-900 min-h-screen flex flex-col text-white">
      <h1 className="text-2xl font-bold p-6 border-b border-gray-700">Quiz App</h1>
      <nav className="flex flex-col mt-4">
        <Link
          to="/generate-quiz"
          className={`px-6 py-3 transition-colors mb-2 rounded-l-full rounded-r-full ${
            location.pathname === "/generate-quiz"
              ? "bg-blue-600 text-white font-semibold"
              : "hover:bg-gray-800 text-gray-300"
          }`}
        >
          Generate Quiz
        </Link>
        <Link
          to="/history"
          className={`px-6 py-3 transition-colors rounded-l-full rounded-r-full ${
            location.pathname === "/history"
              ? "bg-blue-600 text-white font-semibold"
              : "hover:bg-gray-800 text-gray-300"
          }`}
        >
          History
        </Link>
      </nav>
    </div>
  );
}


function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="box-border flex-1 bg-gray-100">
          <Routes>
            <Route path="/generate-quiz" element={<GenerateQuizTab />} />
            <Route path="/history" element={<HistoryTab />} />
            <Route path="*" element={<GenerateQuizTab />} /> {/* default route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

