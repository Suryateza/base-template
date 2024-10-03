import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateNumbers(size) {
  const numbers = Array.from({length: (size * size) / 2}, (_, i) => i + 1);
  return shuffleArray([...numbers, ...numbers]);
}

const CardItem = ({ number, isFlipped, onClick }) => (
  <Card className="w-20 h-20 sm:w-24 sm:h-24 cursor-pointer transform transition-transform duration-300 hover:scale-105">
    <CardContent className="p-0 flex justify-center items-center h-full">
      {isFlipped ? 
        <div className="text-2xl">{number}</div> : 
        <div className="bg-slate-200 w-full h-full flex items-center justify-center">?</div>
      }
    </CardContent>
  </Card>
);

function GameBoard({ size }) {
  const [cards, setCards] = useState(generateNumbers(size));
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [moves, setMoves] = useState(0);
  const [freezeBoard, setFreezeBoard] = useState(false);

  useEffect(() => {
    if (firstCard && secondCard) {
      setFreezeBoard(true);
      const timer = setTimeout(() => {
        if (firstCard.number === secondCard.number) {
          setCards(prev => prev.map(card => 
            card.id === firstCard.id || card.id === secondCard.id ? { ...card, matched: true } : card
          ));
        } else {
          setCards(prev => prev.map(card => 
            card.id === firstCard.id || card.id === secondCard.id ? { ...card, isFlipped: false } : card
          ));
        }
        setFirstCard(null);
        setSecondCard(null);
        setFreezeBoard(false);
        setMoves(m => m + 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [firstCard, secondCard]);

  const handleCardClick = (card) => {
    if (freezeBoard || card.isFlipped || card.matched) return;
    if (!firstCard) {
      setFirstCard(card);
      setCards(prev => prev.map(c => c.id === card.id ? { ...c, isFlipped: true } : c));
    } else if (!secondCard && card.id !== firstCard.id) {
      setSecondCard(card);
      setCards(prev => prev.map(c => c.id === card.id ? { ...c, isFlipped: true } : c));
    }
  };

  const resetGame = () => {
    setCards(shuffleArray(generateNumbers(size)));
    setFirstCard(null);
    setSecondCard(null);
    setMoves(0);
  };

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
      {cards.map((card, index) => (
        <CardItem 
          key={index} 
          number={card.number} 
          isFlipped={card.isFlipped || card.matched} 
          onClick={() => handleCardClick(card)}
        />
      ))}
      <Button onClick={resetGame} className="col-span-4 sm:col-span-2 mt-4">Reset</Button>
      <div className="col-span-4 sm:col-span-3 mt-4">Moves: {moves}</div>
    </div>
  );
}

export default function App() {
  const [gameSize, setGameSize] = useState(4);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isGameActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isGameActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isGameActive, time]);

  const startGame = () => {
    setIsGameActive(true);
    setTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100 p-4">
      <div className="w-full sm:w-3/4 p-4">
        <GameBoard size={gameSize} />
      </div>
      <div className="w-full sm:w-1/4 p-4 bg-white rounded-lg shadow-md">
        <Card>
          <CardHeader>
            <CardTitle>Memory Game</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="gameSize">Difficulty</Label>
            <RadioGroup value={gameSize.toString()} onValueChange={(value) => setGameSize(parseInt(value))} className="mt-2">
              <RadioGroupItem value="4">4x4</RadioGroupItem>
              <RadioGroupItem value="8">8x8</RadioGroupItem>
              <RadioGroupItem value="10">10x10</RadioGroupItem>
            </RadioGroup>
            <Button onClick={startGame} className="mt-4 w-full">Start Game</Button>
            <div className="mt-4">
              <Label>Time: {formatTime(time)}</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}