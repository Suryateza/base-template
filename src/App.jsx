import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TypingTest = () => {
  const text = "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.";
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(intervalRef.current);
      calculateResults();
    }
    return () => clearInterval(intervalRef.current);
  }, [isTimerRunning, timeLeft]);

  const startTest = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      setInput('');
      setTimeLeft(60);
      setWpm(0);
      setAccuracy(100);
    }
  };

  const calculateResults = () => {
    const words = input.trim().split(/\s+/).length;
    const correctChars = input.split('').filter((char, index) => char === text[index]).length;
    const totalChars = text.length;
    setWpm(words);
    setAccuracy((correctChars / totalChars) * 100);
  };

  const handleInputChange = (e) => {
    if (!isTimerRunning) startTest();
    setInput(e.target.value);
  };

  const resetTest = () => {
    clearInterval(intervalRef.current);
    setIsTimerRunning(false);
    setInput('');
    setTimeLeft(60);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Typing Speed Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Type the following text:
            </p>
            <div className="bg-white p-4 rounded-lg shadow text-sm whitespace-pre-wrap">
              {text.split('').map((char, idx) => (
                <span key={idx} className={input[idx] === char ? 'text-green-500' : input[idx] ? 'text-red-500' : ''}>
                  {char}
                </span>
              ))}
            </div>
          </div>
          <Label htmlFor="typingInput">Start typing here:</Label>
          <Input 
            id="typingInput"
            value={input}
            onChange={handleInputChange}
            className="mb-4"
            disabled={timeLeft === 0}
          />
          <div className="flex justify-between items-center">
            <span>Time Left: {timeLeft}s</span>
            <span>WPM: {wpm} | Accuracy: {accuracy.toFixed(2)}%</span>
          </div>
        </CardContent>
        <div className="flex justify-end p-4">
          <Button onClick={resetTest} disabled={isTimerRunning && timeLeft > 0}>Reset</Button>
        </div>
      </Card>
    </div>
  );
};

export default function App() {
  return <TypingTest />;
}