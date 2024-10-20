import React, { useState, useEffect } from "react";
import { data } from "../assets/data"; // Ensure your data is structured properly

const Modal = ({ show, depressionLevel, onClose }) => {
  if (!show) return null;

  let suggestionMessage = "";
  if (depressionLevel === "High Depression") {
    suggestionMessage = "Please consider taking advice from a doctor.";
  } else if (depressionLevel === "Medium Depression") {
    suggestionMessage = "Listen to a podcast, read a book, or try meditation.";
  } else if (depressionLevel === "Depression-Free") {
    suggestionMessage =
      "Congratulations! The test is clear, and you are depression-free.";
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-[400px] text-center">
        <h2 className="text-2xl font-bold mb-4">Suggestion</h2>
        <p className="mb-6">{suggestionMessage}</p>
        <button
          className="bg-blue text-white px-4 py-2 rounded border border-blue-700 hover:bg-blue-700 transition-all"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [depressionLevel, setDepressionLevel] = useState("");

  let question = data[index];

  const checkAns = (e, ans) => {
    setSelectedAnswer(ans);

    // Remove the class from other options
    document.querySelectorAll("li").forEach((li) => {
      li.classList.remove(
        "bg-[#dffff2]",
        "border-[#00d397]",
        "bg-[#FFEBEB]",
        "border-[#FF4A4A]"
      );
    });

    if (question.ans === ans) {
      e.target.classList.add("bg-[#dffff2]", "border-[#00d397]");
      setCorrectAnswers(correctAnswers + 1);
    } else {
      e.target.classList.add("bg-[#FFEBEB]", "border-[#FF4A4A]");
    }

    setIsAnswered(true);
  };

  const nextQuestion = () => {
    if (index < data.length - 1) {
      setIndex(index + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const calculateDepression = () => {
    if (correctAnswers >= 8) {
      return "Depression-Free";
    } else if (correctAnswers >= 5) {
      return "Medium Depression";
    } else {
      return "High Depression";
    }
  };

  useEffect(() => {
    if (showResult) {
      const depressionLevel = calculateDepression();
      setDepressionLevel(depressionLevel);
      setShowModal(true);

      // Save result to local storage
      localStorage.setItem(
        "quizResult",
        JSON.stringify({
          depressionLevel,
          correctAnswers,
        })
      );
    }
  }, [showResult]);

  return (
    <div className="w-[640px] mx-auto mt-[110px] text-[#301730] flex flex-col gap-[20px] rounded-[10px] p-[40px_50px] bg-[#ffe5b4] mb-5">
      <h1 className="text-xl">TEST FOR DEPRESSION</h1>
      <hr className="h-[2px] border-none bg-[#707070]" />
      {showResult ? (
        <div className="result">
          <h2 className="text-[27px] font-medium">
            Your Depression Level: {calculateDepression()}
          </h2>
          <p>
            You answered {correctAnswers} out of {data.length} questions
            correctly.
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-[27px] font-medium">
            {index + 1}. {question.question}
          </h2>
          <ul>
            {[1, 2, 3, 4].map((option) => (
              <li
                key={option}
                className={`flex items-center h-[70px] pl-[15px] border border-[#686868] rounded-[8px] mb-[20px] cursor-pointer text-[20px] ${
                  selectedAnswer === option && isAnswered
                    ? question.ans === option
                      ? "bg-[#dffff2] border-[#00d397]"
                      : "bg-[#FFEBEB] border-[#FF4A4A]"
                    : ""
                }`}
                onClick={(e) => checkAns(e, option)}
              >
                {question[`option${option}`]}{" "}
                {/* Accessing option1, option2, option3, option4 dynamically */}
              </li>
            ))}
          </ul>
          <button
            className="mx-auto w-[250px] h-[65px] bg-[#00d397] text-white text-[25px] font-medium rounded-[8px] hover:bg-[#00b582] cursor-pointer"
            onClick={nextQuestion}
            disabled={!isAnswered}
          >
            Next
          </button>
          <div className="mx-auto text-[18px]">
            {index + 1} of {data.length} questions
          </div>
        </>
      )}
      <Modal
        show={showModal}
        depressionLevel={depressionLevel}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Quiz;
