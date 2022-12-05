import React, { useState, useEffect, useRef } from "react";

import "./QuizComponent.css";
import axios from "axios";

function QuizComponent() {
  const [questionApi, setQuestionApi] = useState([]);
  useEffect(() => {
    axios
      .get(
        `https://the-trivia-api.com/api/questions?categories=science&limit=10&region=IN&difficulty=hard`
      )
      .then(function (response) {
        // console.log(response.data)
        setLoading(false);
        setQuestionApi(response.data);
        console.log(questionApi);
      });
  }, []);

  // const questionbank = [
  //   {
  //     question: "What is the capital of TamilNadu?",
  //     answerText: [
  //       { Answer: "Delhi", isCorrect: false },
  //       { Answer: "Chennai", isCorrect: true },
  //       { Answer: "Kochin", isCorrect: false },
  //       { Answer: "Bangalore", isCorrect: false },
  //     ],
  //   },
  //   {
  //     question: "Who is the CM of TamilNadu?",
  //     answerText: [
  //       { Answer: "Kamal", isCorrect: false },
  //       { Answer: "Modi", isCorrect: false },
  //       { Answer: "Ramesh", isCorrect: false },
  //       { Answer: "Stalin", isCorrect: true },
  //     ],
  //   },
  //   {
  //     question: "What is 7*3?",
  //     answerText: [
  //       { Answer: "30", isCorrect: false },
  //       { Answer: "45", isCorrect: false },
  //       { Answer: "21", isCorrect: true },
  //       { Answer: "20", isCorrect: false },
  //     ],
  //   },
  // ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState("00:00:09");
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleAnswerResponse = (value) => {
    if (value === currentQuestion) {
      setScore(score + 1);
    }
    clearTimer(getDeadTime());
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questionApi.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };


  const resetQuiz = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
    clearTimer(getDeadTime());
  };

  //adding timer Function
  const Ref = useRef(null);
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor(((total / 1000) * 60 * 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };
  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };
  const clearTimer = (e) => {
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };
  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 10);
    return deadline;
  };
  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  //Timer Function
  useEffect(() => {
    console.log("currentQuestion", currentQuestion);
    console.log("questionApi.length", questionApi.length);
    if (currentQuestion < questionApi.length) {
      console.log("entered if");
      if (timer === "00:00:00") {
        setCurrentQuestion(currentQuestion + 1);
        clearTimer(getDeadTime());
        if(currentQuestion === 9){
          setShowScore(true)
        }
      }
    }

    //using next question

    //  const nextQuestion = currentQuestion + 1;
    //   if (nextQuestion < questionApi.length) {
    //     if(timer === '00:00:00'){
    //       setCurrentQuestion(nextQuestion);
    //       clearTimer(getDeadTime())
    //     }
    //   } else {
    //     clearTimer(getDeadTime())
    //     // setTimeout(()=> setShowScore(true),10000)
    //   }
  }, [timer]);

  if (loading) return <div>Loading</div>;

  return (
    <div className="app">
      {showScore ? (
        <div className="score-section">
          You have Scored {score} out of {questionApi.length}
          <>
            <button onClick={resetQuiz} style={{justifyContent:'center'}}>PlayAgain!</button>
          </>
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span style={{ fontSize: "28px" }}>{currentQuestion + 1}</span>/
              {questionApi.length}
            </div>
            <div className="question-text">
              {questionApi[currentQuestion].question}
            </div>
            <div className="question-timer">
              <h2>{timer}</h2>
            </div>
          </div>
          <div className="answer-section">
            {questionApi[currentQuestion].incorrectAnswers.map((answer) => (
              <button key={answer} onClick={() => handleAnswerResponse(answer)}>
                {answer}
              </button>
            ))}
            <button
              key={questionApi[currentQuestion].correctAnswer}
              onClick={() => handleAnswerResponse(currentQuestion)}
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
