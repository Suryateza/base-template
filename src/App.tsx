import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const directions = [
  [0, 1],  // Horizontal
  [1, 0],  // Vertical
  [1, 1],  // Diagonal down
  [-1, 1], // Diagonal up
];

function generateGrid(size, words) {
  let grid = Array(size).fill().map(() => Array(size).fill(''));
  const used = new Set();

  const placeWord = (word) => {
    let placed = false;
    while (!placed) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      if (canPlace(word, row, col, dir, size)) {
        for (let i = 0; i < word.length; i++) {
          grid[row + i * dir[0]][col + i * dir[1]] = word[i];
        }
        placed = true;
      }
    }
  };

  const canPlace = (word, r, c, dir, size) => {
    for (let i = 0; i < word.length; i++) {
      const newR = r + i * dir[0], newC = c + i * dir[1];
      if (newR < 0 || newR >= size || newC < 0 || newC >= size) return false;
      if (grid[newR][newC] !== '' && grid[newR][newC] !== word[i]) return false;
    }
    return true;
  };

  words.forEach(placeWord);
  // Fill remaining cells with random letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!grid[i][j]) grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
    }
  }

  return grid;
}

function App() {
  const [size, setSize] = useState(10);
  const [words, setWords] = useState(['REACT', 'TAILWIND', 'SHADCN', 'GRID', 'GAME']);
  const [grid, setGrid] = useState(() => generateGrid(size, words));
  const [selected, setSelected] = useState([]);
  const [foundWords, setFoundWords] = useState(new Set());
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (foundWords.size === words.length) {
      setGameOver(true);
    }
  }, [foundWords, words.length]);

  const resetGame = () => {
    setGrid(generateGrid(size, words));
    setSelected([]);
    setFoundWords(new Set());
    setGameOver(false);
  };

  const handleCellClick = (row, col) => {
    if (gameOver) return;
    setSelected(prev => {
      if (prev.length === 0 || (prev[prev.length - 1].row === row && prev[prev.length - 1].col === col)) {
        return [...prev, {row, col}];
      } else {
        const word = prev.map(p => grid[p.row][p.col]).join('');
        if (words.includes(word)) {
          setFoundWords(prevSet => new Set(prevSet).add(word));
        }
        return [{row, col}];
      }
    });
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 sm:space-y-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Word Search Game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-10 gap-1">
            {grid.flat().map((letter, index) => {
              const { row, col } = { row: Math.floor(index / size), col: index % size };
              return (
                <div 
                  key={index} 
                  onClick={() => handleCellClick(row, col)} 
                  className={cn(
                    "w-8 h-8 flex items-center justify-center text-lg font-bold border rounded",
                    selected.some(p => p.row === row && p.col === col) && "bg-blue-500 text-white",
                    foundWords.has(selected.map(p => grid[p.row][p.col]).join('')) && "bg-green-500"
                  )}
                >
                  {letter}
                </div>
              );
            })}
          </div>
          <div>
            <h3 className="font-semibold">Words to Find:</h3>
            <ul className="list-disc pl-5">
              {words.map(word => (
                <li key={word} className={foundWords.has(word) ? 'line-through text-green-500' : ''}>{word}</li>
              ))}
            </ul>
          </div>
          {gameOver && <p className="text-center text-green-600 font-bold">Congratulations! You found all the words!</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={resetGame}>New Game</Button>
        </CardFooter>
      </Card>
      <div className="text-sm text-center">
        Found: {foundWords.size}/{words.length}
      </div>
    </div>
  );
}

export default App;