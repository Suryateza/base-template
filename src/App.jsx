import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const MemoryCardGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(5);
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);

  const difficulties = { easy: 5, medium: 10, hard: 15 };

  const setupGame = (size = difficulty) => {
    const numbers = Array.from({ length: (size * size) / 2 }, (_, i) => i + 1);
    const gameCards = [...numbers, ...numbers].sort(() => Math.random() - 0.5);
    setCards(gameCards.map((num, index) => ({ id: index, value: num, matched: false, flipped: false })));
    setMatched([]);
    setMoves(0);
    setTime(0);
    setTimerOn(false);
    setFlippedIndexes([]);
  };

  useEffect(() => {
    if (gameStarted) {
      let timer = null;
      if (timerOn) {
        timer = setInterval(() => setTime(prevTime => prevTime + 1), 1000);
      }
      return () => clearInterval(timer);
    }
  }, [gameStarted, timerOn]);

  const handleCardClick = (index) => {
    if (flippedIndexes.length === 2 || cards[index].flipped || cards[index].matched) return;

    let newFlipped = [...flippedIndexes, index];
    setFlippedIndexes(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      if (cards[newFlipped[0]].value === cards[newFlipped[1]].value) {
        setMatched([...matched, ...newFlipped]);
        setFlippedIndexes([]);
      } else {
        setTimeout(() => setFlippedIndexes([]), 1000);
      }
    }
  };

  useEffect(() => {
    if (matched.length === cards.length) {
      setTimerOn(false);
      setGameStarted(false);
    }
  }, [matched, cards.length]);

  const startGame = () => {
    setGameStarted(true);
    setupGame();
    setTimerOn(true);
  };

  const CardComponent = ({ card, index }) => (
    <Card className="h-20 w-20 sm:h-24 sm:w-24 cursor-pointer" onClick={() => handleCardClick(index)}>
      <CardContent className="p-0 flex justify-center items-center">
        {card.flipped || card.matched ? card.value : "?"}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <div className="flex justify-between w-full max-w-4xl">
        <div className="dashboard space-y-4">
          <Button onClick={startGame} disabled={gameStarted}>Start Game</Button>
          <select onChange={(e) => setDifficulty(parseInt(e.target.value, 10))} value={difficulty} disabled={gameStarted}>
            {Object.entries(difficulties).map(([key, value]) => (
              <option key={key} value={value}>{key}</option>
            ))}
          </select>
          <div>Time: {time}s</div>
          <div>Moves: {moves}</div>
          <Button onClick={() => { setupGame(); setGameStarted(false); }}>Reset Game</Button>
        </div>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10 md:grid-cols-15" style={{ gridTemplateColumns: `repeat(${difficulty}, 1fr)` }}>
          {cards.map((card, index) => (
            <CardComponent key={card.id} card={card} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return <MemoryCardGame />;
}