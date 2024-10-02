// App.jsx
import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Card, CardContent, Textarea } from "@/components/ui";
import { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';

const languages = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'hi': 'Hindi',
  'zh': 'Chinese',
  // Add more languages as needed
};

export default function App() {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [history, setHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setText(result);
    },
  });

  const { speak } = useSpeechSynthesis();

  // Mock translation function - Replace with actual API call
  const mockTranslate = (text, from, to) => {
    // This should be an API call or use a translation library
    return Promise.resolve(`Translated: ${text} from ${from} to ${to}`);
  };

  const translate = async () => {
    const result = await mockTranslate(text, sourceLang, targetLang);
    setTranslatedText(result);
    setHistory([...history, { original: text, translated: result }]);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
      <Card className="max-w-3xl mx-auto mt-10 p-4">
        <CardContent>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Language Translator</h1>
            <Button onClick={toggleDarkMode}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
          <Select 
            value={sourceLang} 
            onChange={(e) => setSourceLang(e.target.value)}>
            <option value="auto">Detect Language</option>
            {Object.entries(languages).map(([code, name]) => 
              <option key={code} value={code}>{name}</option>
            )}
          </Select>
          <Input 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Enter text to translate"
            className="my-2"
          />
          <Button onClick={listen} disabled={listening}>
            {listening ? 'Listening...' : 'Voice Input'}
          </Button>
          <Select 
            value={targetLang} 
            onChange={(e) => setTargetLang(e.target.value)}>
            {Object.entries(languages).map(([code, name]) => 
              <option key={code} value={code}>{name}</option>
            )}
          </Select>
          <Button onClick={translate} className="my-2">Translate</Button>
          <Textarea 
            value={translatedText} 
            readOnly 
            placeholder="Translation will appear here"
          />
          <Button onClick={() => speak({ text: translatedText })}>Listen Translation</Button>
          <div className="mt-4">
            <h2 className="text-xl">Translation History</h2>
            {history.map((item, index) => (
              <div key={index}>{item.original} => {item.translated}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}