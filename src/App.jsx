import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import "./App.css"; // You can add your global Tailwind styles here

const generateCards = (size) => {
    let totalCards = size * size;
    if (totalCards % 2 !== 0) {
        totalCards -= 1;
    }
    const cardValues = [...Array(totalCards / 2).keys()];
    const cards = [...cardValues, ...cardValues].sort(() => Math.random() - 0.5);
    return cards.map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false,
    }));
};

const GameBoard = ({ gridSize, handleCardClick, cards }) => {
    return (
        <div
            className="grid gap-2 p-4 max-w-screen-md mx-auto"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
            {cards.map((card) => (
                <Card
                    key={card.id}
                    className={`w-16 h-16 flex items-center justify-center cursor-pointer ${
                        card.flipped || card.matched ? "bg-blue-500" : "bg-gray-400"
                    }`}
                    onClick={() => handleCardClick(card.id)}
                >
                    <CardContent>
                        <span className="text-white text-xl">
                            {card.flipped || card.matched ? card.value : ""}
                        </span>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

const Dashboard = ({
    moves,
    time,
    resetGame,
    startGame,
    difficulty,
    setDifficulty,
    isGameActive,
}) => {
    return (
        <div className="p-4">
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Game Dashboard</CardTitle>
                    <CardDescription>Control panel for the game</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between mb-2">
                        <span>Moves: {moves}</span>
                        <span>Time: {time}s</span>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            onClick={startGame}
                            disabled={isGameActive} // Disable when game is active
                        >
                            Start Game
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={resetGame}
                        >
                            Reset Game
                        </button>
                        <div className="flex justify-between mt-2">
                            <label>Difficulty:</label>
                            <select
                                value={difficulty}
                                onChange={(e) =>
                                    setDifficulty(parseInt(e.target.value))
                                }
                                className="border rounded px-2"
                            >
                                <option value={4}>Easy</option>
                                <option value={8}>Medium</option>
                                <option value={10}>Hard</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const App = () => {
    const [gridSize, setGridSize] = useState(4);
    const [cards, setCards] = useState([]);
    const [firstCard, setFirstCard] = useState(null);
    const [secondCard, setSecondCard] = useState(null);
    const [moves, setMoves] = useState(0);
    const [time, setTime] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [timerInterval, setTimerInterval] = useState(null);
    const [isGameActive, setIsGameActive] = useState(false); // New state for game activity

    useEffect(() => {
        resetGame();
    }, [gridSize]);

    useEffect(() => {
        if (firstCard && secondCard) {
            if (firstCard.value === secondCard.value) {
                setCards((prevCards) =>
                    prevCards.map((card) =>
                        card.id === firstCard.id || card.id === secondCard.id
                            ? { ...card, matched: true }
                            : card
                    )
                );
            } else {
                setTimeout(() => {
                    setCards((prevCards) =>
                        prevCards.map((card) =>
                            card.id === firstCard.id || card.id === secondCard.id
                                ? { ...card, flipped: false }
                                : card
                        )
                    );
                }, 1000);
            }
            setFirstCard(null);
            setSecondCard(null);
            setMoves((prev) => prev + 1);

            // Check if all cards are matched
            if (cards.every((card) => card.matched || card.flipped)) {
                clearInterval(timerInterval); // Stop timer
                setIsGameActive(false); // Deactivate game
            }
        }
    }, [firstCard, secondCard, cards, timerInterval]);

    const handleCardClick = (id) => {
        if (firstCard && secondCard) return; // Ignore if two cards are already flipped
        const clickedCard = cards.find((card) => card.id === id);
        if (clickedCard.flipped || clickedCard.matched) return; // Ignore already flipped or matched cards

        setCards((prevCards) =>
            prevCards.map((card) =>
                card.id === id ? { ...card, flipped: true } : card
            )
        );

        if (!firstCard) {
            setFirstCard(clickedCard); // Set first card if not selected
        } else {
            setSecondCard(clickedCard); // Set second card if first is already selected
        }
    };

    const resetGame = () => {
        setCards(generateCards(gridSize));
        setFirstCard(null);
        setSecondCard(null);
        setMoves(0);
        setTime(0);
        clearInterval(timerInterval);
        setGameStarted(false);
        setIsGameActive(false); // Reset game activity
    };

    const startGame = () => {
        if (!gameStarted) {
            setGameStarted(true);
            setIsGameActive(true); // Activate game
            setTimerInterval(
                setInterval(() => {
                    setTime((prev) => prev + 1);
                }, 1000)
            );
        }
    };

    const setDifficulty = (size) => {
        setGridSize(size);
        resetGame();
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <div className="flex flex-col md:flex-row justify-center items-center space-x-4">
                <Dashboard
                    moves={moves}
                    time={time}
                    resetGame={resetGame}
                    startGame={startGame}
                    difficulty={gridSize}
                    setDifficulty={setDifficulty}
                    isGameActive={isGameActive} // Pass down game activity status
                />
                <GameBoard
                    gridSize={gridSize}
                    handleCardClick={handleCardClick}
                    cards={cards}
                />
            </div>
        </div>
    );
};

export default App;
