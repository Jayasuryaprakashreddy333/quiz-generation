import {useState} from 'react';
import {generateQuiz} from '../services/api';
import QuizDisplay from '../components/QuizDisplay.jsx';

export default function GenerateQuizTab() {
  const [url, setUrl] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const submitQuiz = async () => {
    setLoading(true);
    try {
      console.log("Submitting URL:", url);
      const result =  await generateQuiz(url);
      setUrl('');
      setQuizData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
  <div className="h-full w-full bg-black flex flex-col items-center justify-center">
    <h1 className="text-4xl text-white mb-8">Generate Quiz</h1>
    <div className="w-full max-w-xl flex items-center bg-gray-800 rounded-full px-4 py-2">
    <input
      type={url}
      placeholder="Paste wiki url to generate quiz..."
      className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-2"
      onChange={(e) => setUrl(e.target.value)}
    />
    <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full flex items-center justify-center" onClick={submitQuiz}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12l12-6-6 12-2-4-4-2z" />
      </svg>
    </button>
  </div>
    {loading && <p className="text-white mt-4 text-center">Generating quiz...</p>}
    {loading && <div className="flex items-center justify-center  mt-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>}
    {quizData && <QuizDisplay quizData={quizData.quiz} />}
  </div>
  )
}