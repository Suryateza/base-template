// App.jsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const App = () => {
  const [gridSize, setGridSize] = useState(10);
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');

  const directions = [
    [0, 1],  // horizontal
    [1, 0],  // vertical
    [1, 1],  // diagonal down-right
    [-1, 1]  // diagonal up-right
  ];
  
  const generateGrid = () => {
    let newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
    let newWords = ['REACT', 'JAVASCRIPT', 'NODE', 'TAILWIND', 'CSS', 'HTML'];
    
    newWords.forEach(word => {
      let placed = false;
      while (!placed) {
        let dir = directions[Math.floor(Math.random() * directions.length)];
        let x = Math.floor(Math.random() * gridSize);
        let y = Math.floor(Math.random() * gridSize);
        
        if (canPlaceWord(newGrid, word, x, y, dir)) {
          placeWord(newGrid, word, x, y, dir);
          placed = true;
        }
      }
    });

    // Fill remaining spaces with random letters
    fillRandomLetters(newGrid);
    setGrid(newGrid);
    setWords(newWords);
    setFoundWords([]);
  };

  const canPlaceWord = (grid, word, x, y, [dx, dy]) => {
    for (let i = 0; i < word.length; i++) {
      if (x < 0 || y < 0 || x >= gridSize || y >= gridSize || grid[y][x] !== '') return false;
      x += dx;
      y += dy;
    }
    return true;
  };

  const placeWord = (grid, word, x, y, [dx, dy]) => {
    for (let char of word) {
      grid[y][x] = char;
      x += dx;
      y += dy;
    }
  };
  const fillRandomLetters = (grid) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === '') {
          grid[i][j] = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
      }
    }
  };
  

  const handleCellClick = (x, y) => {
    // Simplified selection logic, needs enhancement for actual gameplay
    let word = grid[y][x];
    if (words.includes(word) && !foundWords.includes(word)) {
      setFoundWords(prev => [...prev, word]);
      if (foundWords.length + 1 === words.length) {
        setGameStatus('won');
      }
    }
  };

  useEffect(() => {
    generateGrid();
  }, [gridSize]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Word Search Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid grid-cols-10 gap-1">
              {grid.map((row, y) => row.map((cell, x) => 
                <div key={`${x}-${y}`} className="bg-gray-200 flex justify-center items-center h-8 w-8" onClick={() => handleCellClick(x, y)}>
                  {cell}
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-bold mb-2">Words to Find:</h3>
              <ul>
                {words.map(word => (
                  <li key={word} className={`mb-1 ${foundWords.includes(word) ? 'line-through' : ''}`}>
                    {word}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {gameStatus === 'won' && <p className="mt-4 text-green-600">Congratulations! You found all the words!</p>}
          <Button onClick={generateGrid} className="mt-4">New Game</Button>
        </CardContent>
      </Card>
    </div>
    
  );
};

export default App;