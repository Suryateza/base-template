import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Jupiter", "Venus", "Mercury"],
    correctAnswer: "Mars"
  },
  // Add more questions here
];

function QuizQuestion({ question, currentQuestion, totalQuestions, onAnswer }) {
  return (
    <Card className="w-full max-w-lg mx-auto my-4">
      <CardHeader>
        <CardTitle>Question {currentQuestion + 1}/{totalQuestions}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{question.question}</p>
        <div className="mt-4 space-y-2">
          {question.options.map((option, idx) => (
            <Button 
              key={idx} 
              variant="outline"
              className="w-full"
              onClick={() => onAnswer(option === question.correctAnswer)}>
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Result({ score, total, onRestart }) {
  return (
    <Card className="max-w-lg mx-auto my-4">
      <CardContent>
        <h2 className="text-2xl font-bold">Quiz Completed!</h2>
        <p>Your Score: {score} out of {total}</p>
        <Button onClick={onRestart} className="mt-4">Restart Quiz</Button>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerOn && !quizEnded) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!timerOn || quizEnded) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerOn, quizEnded]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizEnded(true);
    }
    setTimerOn(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizEnded(false);
    setTime(0);
    setTimerOn(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4">General Knowledge Quiz</h1>
      {!quizEnded ? (
        <QuizQuestion 
          question={questions[currentQuestion]} 
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          onAnswer={handleAnswer} 
        />
      ) : (
        <Result score={score} total={questions.length} onRestart={restartQuiz} />
      )}
      {timerOn && !quizEnded && <p className="mt-2">Time: {time} seconds</p>}
    </div>
  );
}