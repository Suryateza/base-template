import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const generateCards = () => {
  const numbers = Array.from({ length: 8 }, (_, i) => i + 1);
  const doubledNumbers = [...numbers, ...numbers];
  return doubledNumbers.sort(() => Math.random() - 0.5);
};

export default function App() {
  const [cards, setCards] = useState(generateCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (timerRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerRunning]);

  useEffect(() => {
    if (matchedCards.length === cards.length) {
      setIsGameOver(true);
      setTimerRunning(false);
    }
  }, [matchedCards, cards]);

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return;
    }
    if (!timerRunning) setTimerRunning(true);

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves((prevMoves) => prevMoves + 1);

      if (cards[newFlippedCards[0]] === cards[newFlippedCards[1]]) {
        setMatchedCards([...matchedCards, ...newFlippedCards]);
      }

      setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
    }
  };

  const resetGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setIsGameOver(false);
    setTime(0);
    setTimerRunning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <Card className="w-full max-w-xl bg-white shadow-xl rounded-lg p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">Memory Card Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {cards.map((number, index) => (
              <div
                key={index}
                className={`h-24 flex items-center justify-center rounded-lg text-white text-2xl font-bold cursor-pointer transition-transform transform ${
                  flippedCards.includes(index) || matchedCards.includes(index)
                    ? "bg-green-500 scale-105"
                    : "bg-blue-400 hover:scale-105"
                }`}
                onClick={() => handleCardClick(index)}
              >
                {flippedCards.includes(index) || matchedCards.includes(index)
                  ? number
                  : "?"}
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-700">Moves: {moves}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">Time: {time}s</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center mt-4">
          <button
            onClick={resetGame}
            className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-transform transform hover:scale-105"
          >
            {isGameOver ? "Play Again" : "Reset"}
          </button>
        </CardFooter>
      </Card>
      {isGameOver && (
        <div className="mt-4 text-2xl font-bold text-white animate-bounce">
          Congratulations! You matched all cards!
        </div>
      )}
    </div>
  );
}
