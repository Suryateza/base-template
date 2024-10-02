import React, { useState, useEffect } from 'react';
import { Button, Input, Select, SelectItem, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDebounce } from '@/hooks/useDebounce';
import { useTranslation } from '@/hooks/useTranslation';
import { useSpeech } from '@/hooks/useSpeech';

const languages = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  // Add more languages here
];

function TranslationHistory({ history, onSelect }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Translation History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.map((item, index) => (
          <div key={index} onClick={() => onSelect(item)} className="cursor-pointer hover:bg-gray-100 p-2">
            {item.text} → {item.translation}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function LanguageTranslator() {
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [translation, setTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const debouncedText = useDebounce(text, 500);
  const { translate } = useTranslation();
  const { speak, listen } = useSpeech();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (debouncedText) {
      translateText(debouncedText);
    }
  }, [debouncedText, sourceLang, targetLang]);

  const translateText = async (textToTranslate) => {
    setIsTranslating(true);
    const result = await translate(textToTranslate, sourceLang, targetLang);
    setTranslation(result);
    setHistory(prev => [...prev, { text: textToTranslate, translation: result }].slice(-10));
    setIsTranslating(false);
  };

  const handleVoiceInput = () => {
    listen(text => setText(text), sourceLang);
  };

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Language Translator</CardTitle>
          <CardDescription>Translate text effortlessly.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Enter text to translate"
            className="mb-4"
          />
          <div className="flex mb-4">
            <Button onClick={handleVoiceInput} variant="outline">Speak</Button>
            <Select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="ml-2">
              <SelectItem value="auto">Auto Detect</SelectItem>
              {languages.map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}
            </Select>
          </div>
          <Select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
            {languages.map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}
          </Select>
          <Button onClick={() => translateText(text)} disabled={isTranslating} className="mt-4 w-full">
            Translate
          </Button>
          {translation && 
            <div className="mt-4">
              <p>{translation}</p>
              <Button onClick={() => speak(translation, targetLang)} className="mt-2">Listen</Button>
            </div>
          }
        </CardContent>
      </Card>
      <TranslationHistory history={history} onSelect={item => setText(item.text)} />
    </div>
  );
}

export default function App() {
  return <LanguageTranslator />;
}