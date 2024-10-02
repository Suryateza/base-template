import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const hardcodedPassage = `The quick brown fox jumps over the lazy dog. This is a typing test to measure your speed and accuracy. Type the sentence as fast and as accurately as possible.`;

const calculateWPM = (typedText, timeElapsed) => {
    const words = typedText.trim().split(/\s+/).length;
    const minutes = timeElapsed / 60;
    return Math.round(words / minutes) || 0;
};

const calculateAccuracy = (typedText, originalText) => {
    let correctChars = 0;
    for (let i = 0; typedText[i] && i < originalText.length; i++) {
        if (typedText[i] === originalText[i]) {
            correctChars++;
        }
    }
    return Math.round((correctChars / originalText.length) * 100) || 0;
};

export default function App() {
    const [typedText, setTypedText] = useState("");
    const [timeLeft, setTimeLeft] = useState(60);
    const [isTyping, setIsTyping] = useState(false);
    const [wpm, setWPM] = useState(0);
    const [accuracy, setAccuracy] = useState(100);

    useEffect(() => {
        let timer;
        if (isTyping && timeLeft > 0) {
            timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsTyping(false);
        }
        return () => clearTimeout(timer);
    }, [isTyping, timeLeft]);

    const handleInputChange = (e) => {
        const input = e.target.value;
        if (!isTyping) setIsTyping(true);
        setTypedText(input);
        setWPM(calculateWPM(input, 60 - timeLeft));
        setAccuracy(calculateAccuracy(input, hardcodedPassage));
    };

    const resetTest = () => {
        setTypedText("");
        setTimeLeft(60);
        setIsTyping(false);
        setWPM(0);
        setAccuracy(100);
    };

    const renderHighlightedText = () => {
        return hardcodedPassage.split("").map((char, idx) => {
            let color = "";
            if (idx < typedText.length) {
                color = typedText[idx] === char ? "text-green-500" : "text-red-500";
            }
            return (
                <span key={idx} className={color}>
                    {char}
                </span>
            );
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-4">
            <Card className="w-full max-w-xl p-4 bg-white shadow-lg rounded-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-blue-700">Typing Speed Game</CardTitle>
                    <CardDescription className="text-lg text-gray-500 mt-2">Type the passage as fast as you can!</CardDescription>
                </CardHeader>
                <CardContent className="mt-4">
                    <div className="text-md font-medium mb-4 leading-relaxed border border-gray-300 p-3 rounded-lg bg-gray-100 max-h-40 overflow-auto">
                        {renderHighlightedText()}
                    </div>
                    <textarea
                        value={typedText}
                        onChange={handleInputChange}
                        placeholder="Start typing here..."
                        disabled={timeLeft === 0}
                        className="w-full h-24 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 text-md resize-none"
                    />
                </CardContent>
                <CardFooter className="flex justify-between mt-6">
                    <div className="flex space-x-6 text-center">
                        <div>
                            <h3 className="text-gray-700 text-md">Time Left</h3>
                            <p className="text-xl font-bold text-purple-600 animate-pulse">{timeLeft}s</p>
                        </div>
                        <div>
                            <h3 className="text-gray-700 text-md">WPM</h3>
                            <p className="text-xl font-bold text-blue-600">{wpm}</p>
                        </div>
                        <div>
                            <h3 className="text-gray-700 text-md">Accuracy</h3>
                            <p className="text-xl font-bold text-green-600">{accuracy}%</p>
                        </div>
                    </div>
                    <button
                        onClick={resetTest}
                        className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-transform transform hover:scale-105"
                    >
                        Reset
                    </button>
                </CardFooter>
            </Card>
        </div>
    );
}
