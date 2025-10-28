import { useState } from "react";

export default function QuizDisplay({ quizData }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = quizData.quiz[currentQuestionIndex]; // <-- changed here
  console.log(quizData)
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < quizData.quiz.length) {
      setCurrentQuestionIndex(nextQuestion);
      setSelectedOption("");
      setShowExplanation(false);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="h-[600px] w-[600px] flex items-center justify-center bg-gray-100 p-2 m-3 rounded-lg shadow-lg">
      {showScore ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-lg">
            You scored <span className="font-bold">{score}</span> out of{" "}
            {quizData.quiz.length}
          </p>
        </div>
      ) : (
        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
          {/* Question Header */}
          <div className="mb-2 flex justify-between items-center">
            <div className="text-gray-600">
              Question {currentQuestionIndex + 1}/{quizData.quiz.length}
            </div>
            <div className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-semibold">
              {currentQuestion.difficulty}
            </div>
          </div>

          {/* Question Text */}
          <div className="text-xl font-semibold mb-4">{currentQuestion.question}</div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                  ${
                    showExplanation
                      ? option === currentQuestion.answer
                        ? "bg-green-500 text-white border-green-600"
                        : option === selectedOption
                        ? "bg-red-500 text-white border-red-600"
                        : "bg-gray-100 border-gray-300 text-gray-700"
                      : selectedOption === option
                      ? "bg-blue-100 border-blue-400"
                      : "bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700"
                  }
                `}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleOptionSelect(option)}
                  disabled={showExplanation}
                  className="mr-3"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          {/* Submit / Next Button */}
          {!showExplanation ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Submit
            </button>
          ) : (
            <>
              {/* Explanation */}
              <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded-lg">
                {currentQuestion.explanation}
              </div>
              <button
                onClick={handleNextQuestion}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {currentQuestionIndex + 1 < quizData.quiz.length
                  ? "Next Question"
                  : "See Score"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
