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
    for (let i = 0; i < typedText.length; i++) {
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
                color = typedText[idx] === char ? "text-green-600" : "text-red-600";
            }
            return (
                <span key={idx} className={color}>
                    {char}
                </span>
            );
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-3xl p-6 bg-white shadow-lg">
                <CardHeader>
                    <CardTitle>Typing Speed Test</CardTitle>
                    <CardDescription>
                        Type the passage below as fast and accurately as you can.
                    </CardDescription>
                </CardHeader>
                <CardContent className="mt-4">
                    <div className="text-lg font-medium mb-6">
                        {renderHighlightedText()}
                    </div>
                    <textarea
                        value={typedText}
                        onChange={handleInputChange}
                        placeholder="Start typing here..."
                        disabled={timeLeft === 0}
                        className="w-full h-32 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    />
                </CardContent>
                <CardFooter className="flex justify-between mt-4">
                    <div className="flex space-x-4">
                        <div className="text-center">
                            <h3 className="text-gray-700 text-lg">Time Left</h3>
                            <p className="text-2xl font-bold">{timeLeft}s</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-gray-700 text-lg">WPM</h3>
                            <p className="text-2xl font-bold">{wpm}</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-gray-700 text-lg">Accuracy</h3>
                            <p className="text-2xl font-bold">{accuracy}%</p>
                        </div>
                    </div>
                    <button
                        onClick={resetTest}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Reset
                    </button>
                </CardFooter>
            </Card>
        </div>
    );
}
