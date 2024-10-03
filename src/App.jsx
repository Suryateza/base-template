import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const App = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('4x4');

  const difficulties = {
    '4x4': 16,
    '8x8': 64,
    '10x10': 100
  };

  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => setTime(prevTime => prevTime + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted]);

  const setupGame = (size = difficulties[difficulty]) => {
    let numbers = Array.from({length: size}, (_, i) => Math.floor(i / 2));
    numbers = [...numbers, ...numbers].sort(() => Math.random() - 0.5);
    setCards(numbers.map((num, index) => ({ id: index, value: num, flipped: false, matched: false })));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setGameStarted(true);
  };

  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    const card = cards.find(c => c.id === id);
    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      if (cards.find(c => c.id === newFlipped[0]).value === card.value) {
        setMatched(prev => [...prev, ...newFlipped]);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setupGame();
  };

  useEffect(() => {
    if (matched.length === cards.length) {
      setGameStarted(false);
      // Here you could show a win message or prompt for another game
    }
  }, [matched, cards.length]);

  useEffect(setupGame, [difficulty]); // Setup game when difficulty changes

  return (
    <div className="flex flex-col items-center space-y-4 p-4 min-h-screen bg-gray-100">
      <div className="flex justify-between w-full max-w-4xl">
        <select 
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value)}
          className="p-2 border rounded-md"
        >
          {Object.keys(difficulties).map(diff => <option key={diff} value={diff}>{diff}</option>)}
        </select>
        <Button onClick={gameStarted ? resetGame : setupGame}>
          {gameStarted ? "Reset" : "Start"}
        </Button>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 md:grid-cols-10 max-w-4xl w-full">
          {cards.map(card => (
            <Card 
              key={card.id} 
              className={`cursor-pointer ${card.flipped || card.matched ? 'bg-blue-100' : 'bg-white'} ${card.matched ? 'opacity-50' : ''}`}
              onClick={() => handleCardClick(card.id)}
            >
              <CardContent className="p-0">
                <div className="w-full h-24 flex items-center justify-center text-2xl font-bold">
                  {card.flipped || card.matched ? card.value : '?'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <p>Moves: {moves}</p>
          <p>Time: {time} seconds</p>
        </div>
      </div>
    </div>
  );
};

export default App;