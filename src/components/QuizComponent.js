import React, { useState, useEffect } from "react";

import "./QuizComponent.css";
import axios from "axios";

function QuizComponent() {
  const [questionApi, setQuestionApi] = useState([]);
  useEffect(() => {
    axios
      .get(
        `https://the-trivia-api.com/api/questions?categories=science&limit=5&region=IN&difficulty=hard`
      )
      .then(function (response) {
        // console.log(response.data)
        setLoading(false);
        setQuestionApi(response.data);
        console.log(questionApi);
      });
  }, []);

  const questionbank = [
    {
      question: "What is the capital of TamilNadu?",
      answerText: [
        { Answer: "Delhi", isCorrect: false },
        { Answer: "Chennai", isCorrect: true },
        { Answer: "Kochin", isCorrect: false },
        { Answer: "Bangalore", isCorrect: false },
      ],
    },
    {
      question: "Who is the CM of TamilNadu?",
      answerText: [
        { Answer: "Kamal", isCorrect: false },
        { Answer: "Modi", isCorrect: false },
        { Answer: "Ramesh", isCorrect: false },
        { Answer: "Stalin", isCorrect: true },
      ],
    },
    {
      question: "What is 7*3?",
      answerText: [
        { Answer: "30", isCorrect: false },
        { Answer: "45", isCorrect: false },
        { Answer: "21", isCorrect: true },
        { Answer: "20", isCorrect: false },
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleAnswerResponse = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion <questionApi.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
  };
  if (loading) return <div>Loading</div>;
  return (
    <div className="app">
      {showScore ? (
        <div className="score-section">
          You have Scored {score} out of {questionApi.length}
          <>
            <button onClick={resetQuiz}>PlayAgain!</button>
          </>
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>
                {currentQuestion}/{questionApi.length}
              </span>
            </div>
            <div className="question-text">
              {questionApi[currentQuestion].question}
            </div>
          </div>
          <div className="answer-section">
            {questionApi[currentQuestion].incorrectAnswers.map((answer) => (
              <button
                key={answer}
                onClick={() => handleAnswerResponse(answer)}
              >
                {answer}
              </button>
            ))}
            <button
                key={questionApi[currentQuestion].correctAnswer}
              onClick={() =>
                handleAnswerResponse(questionApi[currentQuestion].correctAnswer)
              }
            >
              {questionApi[currentQuestion].correctAnswer}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default QuizComponent;
