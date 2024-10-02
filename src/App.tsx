import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const App = () => {
  const [gridSize, setGridSize] = useState(10);
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const [timer, setTimer] = useState(300); // 5 minutes timer

  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal down-right
    [-1, 1], // diagonal up-right
  ];

  useEffect(() => {
    if (timer > 0 && gameStatus === "playing") {
      const intervalId = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(intervalId);
    } else if (timer === 0) {
      setGameStatus("lost");
    }
  }, [timer, gameStatus]);

  const generateGrid = useCallback(() => {
    let newGrid = Array(gridSize)
      .fill()
      .map(() => Array(gridSize).fill(""));
    let newWords = ["REACT", "JAVASCRIPT", "NODE", "TAILWIND", "CSS", "HTML"];

    newWords.forEach((word) => {
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

    fillRandomLetters(newGrid);
    setGrid(newGrid);
    setWords(newWords);
    setFoundWords([]);
    setHighlightedCells([]);
    setSelectedCells([]);
    setScore(0);
    setTimer(300);
    setGameStatus("playing");
  }, [gridSize]);

  const canPlaceWord = (grid, word, x, y, [dx, dy]) => {
    for (let i = 0; i < word.length; i++) {
      if (x < 0 || y < 0 || x >= gridSize || y >= gridSize || grid[y][x] !== "")
        return false;
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
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === "") {
          grid[i][j] = alphabet.charAt(
            Math.floor(Math.random() * alphabet.length)
          );
        }
      }
    }
  };

  const handleCellClick = (x, y) => {
    setSelectedCells((prev) => {
      const alreadySelected = prev.some((cell) => cell.x === x && cell.y === y);
      if (alreadySelected) {
        return prev.filter((cell) => !(cell.x === x && cell.y === y));
      } else {
        const newSelection = [...prev, { x, y }];
        checkForMatch(newSelection);
        return newSelection;
      }
    });
  };

  const checkForMatch = (cells) => {
    const selectedWord = cells.map(({ x, y }) => grid[y][x]).join("");
    const reversedWord = cells
      .map(({ x, y }) => grid[y][x])
      .reverse()
      .join("");

    if (
      (words.includes(selectedWord) || words.includes(reversedWord)) &&
      !foundWords.includes(selectedWord)
    ) {
      setFoundWords((prev) => [...prev, selectedWord]);
      setScore((prev) => prev + 10);
      highlightWord(cells);
      setSelectedCells([]);
    }
  };

  const highlightWord = (cells) => {
    setHighlightedCells((prev) => [...prev, ...cells]);
  };

  useEffect(() => {
    generateGrid();
  }, [generateGrid]);

  const handleGridSizeChange = (event) => {
    setGridSize(Number(event.target.value));
    generateGrid();
  };

  const resetGame = () => {
    generateGrid();
  };

  return (
    <div className="container mx-auto p-4 flex">
      {/* Sidebar */}
      <div className="w-1/3 pr-4">
        <Card className="bg-gray-100 shadow-lg">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3>Words to Find:</h3>
              <ul>
                {words.map((word) => (
                  <li
                    key={word}
                    className={
                      foundWords.includes(word)
                        ? "line-through text-gray-400"
                        : ""
                    }
                  >
                    {word}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <p>Score: {score}</p>
              <p>
                Time Left:{" "}
                {`${Math.floor(timer / 60)}:${String(timer % 60).padStart(
                  2,
                  "0"
                )}`}
              </p>
            </div>
            <div className="mb-4">
              <h4>Select Grid Size:</h4>
              <select
                value={gridSize}
                onChange={handleGridSizeChange}
                className="p-2 border rounded"
              >
                <option value={10}>10x10</option>
                <option value={15}>15x15</option>
              </select>
            </div>
            <div className="mb-4">
              <Button onClick={resetGame}>Reset Game</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Grid */}
      <div className="w-2/3">
        <Card className="bg-gray-100 shadow-lg">
          <CardHeader>
            <CardTitle>Word Search Game</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`grid gap-1`}
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 2.5rem)`,
                gridTemplateRows: `repeat(${gridSize}, 2.5rem)`,
              }}
            >
              {grid.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`bg-gray-200 flex justify-center items-center h-10 w-10 cursor-pointer transition-colors ${
                      selectedCells.some((c) => c.x === x && c.y === y)
                        ? "bg-yellow-300"
                        : ""
                    } ${
                      highlightedCells.some((c) => c.x === x && c.y === y)
                        ? "bg-green-400 text-white font-bold"
                        : ""
                    }`}
                    onClick={() => handleCellClick(x, y)}
                  >
                    {cell}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
