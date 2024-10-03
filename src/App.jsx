import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DIFFICULTIES = {
  easy: { rows: 5, cols: 5 },
  medium: { rows: 10, cols: 10 },
  hard: { rows: 15, cols: 15 }
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateCards(difficulty) {
  const { rows, cols } = DIFFICULTIES[difficulty];
  const totalCards = rows * cols;
  let numbers = Array.from({length: totalCards / 2}, (_, i) => i + 1);
  numbers = numbers.concat(numbers);
  return shuffleArray(numbers).map((num, index) => ({
    id: index,
    number: num,
    isFlipped: false,
    isMatched: false
  }));
}

function MemoryCard({ card, onCardClick }) {
  return (
    <Card 
      className={`cursor-pointer ${card.isFlipped || card.isMatched ? 'bg-blue-200' : 'bg-gray-200'} transition-all duration-300`}
      onClick={() => !card.isFlipped && !card.isMatched && onCardClick(card.id)}
    >
      <CardContent className="flex justify-center items-center">
        {card.isFlipped || card.isMatched ? card.number : '?'}
      </CardContent>
    </Card>
  );
}

function Dashboard({ onStart, onReset, moves, time, onDifficultyChange, currentDifficulty }) {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <Button onClick={onStart}>Start Game</Button>
      <Button onClick={onReset}>Reset Game</Button>
      <div>
        <label>Difficulty: </label>
        <select onChange={onDifficultyChange} value={currentDifficulty}>
          {Object.keys(DIFFICULTIES).map(diff => (
            <option key={diff} value={diff}>{diff}</option>
          ))}
        </select>
      </div>
      <div>Time: {time}s</div>
      <div>Moves: {moves}</div>
    </div>
  );
}

export default function App() {
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');

  useEffect(() => {
    let timer;
    if (isGameRunning) {
      timer = setInterval(() => setTime(prevTime => prevTime + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isGameRunning]);

  const handleCardClick = (id) => {
    if (firstCard === null) {
      setFirstCard(id);
      setCards(cards.map(c => c.id === id ? { ...c, isFlipped: true } : c));
    } else if (secondCard === null && id !== firstCard) {
      setSecondCard(id);
      setCards(cards.map(c => c.id === id ? { ...c, isFlipped: true } : c));
      setMoves(moves + 1);
    }
  };

  useEffect(() => {
    if (firstCard && secondCard) {
      if (cards[firstCard].number === cards[secondCard].number) {
        setCards(cards => cards.map(c => 
          c.id === firstCard || c.id === secondCard ? { ...c, isMatched: true } : c
        ));
      } else {
        setTimeout(() => {
          setCards(cards => cards.map(c => 
            c.id === firstCard || c.id === secondCard ? { ...c, isFlipped: false } : c
          ));
        }, 1000);
      }
      setFirstCard(null);
      setSecondCard(null);
    }
  }, [firstCard, secondCard, cards]);

  const startGame = () => {
    setCards(generateCards(difficulty));
    setMoves(0);
    setTime(0);
    setIsGameRunning(true);
  };

  const resetGame = () => {
    setCards([]);
    setFirstCard(null);
    setSecondCard(null);
    setMoves(0);
    setTime(0);
    setIsGameRunning(false);
  };

  const changeDifficulty = (event) => {
    setDifficulty(event.target.value);
    resetGame();
  };

  const { rows, cols } = DIFFICULTIES[difficulty];

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100 p-4">
      <div className="sm:w-3/4 grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-4">
        {cards.map(card => (
          <MemoryCard key={card.id} card={card} onCardClick={handleCardClick} />
        ))}
      </div>
      <div className="sm:w-1/4 mt-4 sm:mt-0">
        <Dashboard 
          onStart={startGame} 
          onReset={resetGame} 
          moves={moves} 
          time={time} 
          onDifficultyChange={changeDifficulty}
          currentDifficulty={difficulty}
        />
      </div>
    </div>
  );
}