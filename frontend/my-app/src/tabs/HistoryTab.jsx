import { useState, useEffect } from "react";
import QuizDisplay from "../components/QuizDisplay" // import your QuizDisplay component
import { fetchQuizById,fetchQuizHistory } from "../services/api"; // import your API service 
import HistoryTable from "../components/HistoryTable";

export default function HistoryTab() {
  const [history, setHistory] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch quiz history on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await fetchQuizHistory();
        setHistory(data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, []);

  const handleDetails = async (quizId) => {
    try {
      const data = await fetchQuizById(quizId);
      setSelectedQuiz(data);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching quiz:", err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQuiz(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Quiz History</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">URL</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {history && history.map((item) => (
               <HistoryTable key={item.id} details={item} onDetails={handleDetails} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedQuiz && (
        <div className="h-[600px] w-[650px] flex flex-col justify-center bg-gray-100  rounded-lg shadow-lg pr-4">
            <div className="flex flex-row justify-end p-2 mt-4">
                <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 font-bold"
                >
                ✕
                </button>
            </div>
            <QuizDisplay quizData={selectedQuiz.quiz} />
        </div>
      )}
    </div>
  );
}