import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    correctAnswer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  },
  // Add more questions here...
];

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizEnded, setQuizEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds for the quiz

  useEffect(() => {
    if (timeLeft > 0 && !quizEnded) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !quizEnded) {
      setQuizEnded(true);
    }
  }, [timeLeft, quizEnded]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizEnded(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setQuizEnded(false);
    setTimeLeft(60);
  };

  if (quizEnded) {
    return (
      <Card className="max-w-lg mx-auto mt-10">
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl mb-4">Your Score: {score} out of {questions.length}</p>
          <p>Time's up! You scored {score} points.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={restartQuiz}>Restart Quiz</Button>
        </CardFooter>
      </Card>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle>{question.question}</CardTitle>
        <CardDescription>Time Left: {timeLeft}s</CardDescription>
      </CardHeader>
      <CardContent>
        {question.options.map((option, index) => (
          <Button 
            key={index} 
            variant={selectedAnswer === option ? "default" : "outline"}
            onClick={() => handleAnswer(option)}
            className="w-full mb-2"
          >
            {option}
          </Button>
        ))}
      </CardContent>
      <CardFooter>
        {selectedAnswer && (
          <Button onClick={nextQuestion} className="mt-4">
            {currentQuestion + 1 === questions.length ? 'Finish' : 'Next Question'}
          </Button>
        )}
      </CardFooter>
    </Card>
    
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Quiz />
    </div>
  );
}