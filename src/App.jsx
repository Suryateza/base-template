// App.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const App = () => {
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [start, setStart] = useState(false);
  const timerRef = useRef(null);

  const passage = "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.";

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, isTimerRunning]);

  const handleChange = (e) => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      setStart(true);
    }
    setUserInput(e.target.value);
  };

  const resetTest = () => {
    setUserInput("");
    setTimeLeft(60);
    setIsTimerRunning(false);
    setStart(false);
    clearTimeout(timerRef.current);
  };

  const calculateWPM = () => {
    const words = userInput.trim().split(' ').length;
    const minutes = 1 - (timeLeft / 60);
    return Math.round(words / minutes);
  };

  const accuracy = () => {
    const match = passage.slice(0, userInput.length) === userInput;
    return match ? 100 : ((userInput.length / passage.length) * 100).toFixed(2);
  };

  const HighlightedText = ({ text, userInput }) => {
    return (
      <div className="text-sm md:text-base">
        {text.split('').map((char, index) => {
          let color = index < userInput.length 
            ? char === userInput[index] ? 'text-green-500' : 'text-red-500' 
            : 'text-gray-500';
          return <span key={index} className={color}>{char}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg p-6 shadow-lg">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Typing Speed Test</h1>
        </CardHeader>
        <CardContent>
          {!start ? (
            <p>Click start to begin the typing test.</p>
          ) : (
            <>
              <HighlightedText text={passage} userInput={userInput} />
              <Input 
                value={userInput} 
                onChange={handleChange} 
                placeholder="Start typing here..." 
                className="mt-4"
                disabled={!isTimerRunning}
              />
              <div className="mt-4 text-center">
                <p>Time Left: {timeLeft}s</p>
                {timeLeft === 0 && (
                  <div>
                    <p>WPM: {calculateWPM()}</p>
                    <p>Accuracy: {accuracy()}%</p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
        <div className="flex justify-center mt-4">
          <Button onClick={resetTest} disabled={!start}>Reset</Button>
        </div>
      </Card>
    </div>
  );
};

export default App;