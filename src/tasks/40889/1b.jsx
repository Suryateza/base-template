import React, { useState, useEffect } from 'react';
import { Button, Input, Select, SelectItem, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  // Add more languages here
];

function LanguageTranslator() {
  const [textToTranslate, setTextToTranslate] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const [translationHistory, setTranslationHistory] = useState([]);

  // Placeholder for translation logic
  const translate = () => {
    // Here you would typically call an API for translation
    setTranslatedText(`Translated text in ${targetLang}: ${textToTranslate}`);
    setTranslationHistory([...translationHistory, { original: textToTranslate, translation: translatedText, from: sourceLang, to: targetLang }]);
  };

  const handleVoiceInput = () => {
    // Placeholder for voice recognition logic
    console.log('Voice input functionality to be implemented');
  };

  const handleVoiceOutput = () => {
    // Placeholder for text-to-speech logic
    console.log('Voice output functionality to be implemented');
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Language Translator</CardTitle>
          <CardDescription>Translate text effortlessly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input 
            type="text" 
            placeholder="Enter text to translate" 
            value={textToTranslate} 
            onChange={(e) => setTextToTranslate(e.target.value)} 
          />
          <div className="flex space-x-2">
            <Select value={sourceLang} onChange={(value) => setSourceLang(value)}>
              <SelectItem value="auto">Detect Language</SelectItem>
              {languages.map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}
            </Select>
            <Select value={targetLang} onChange={(value) => setTargetLang(value)}>
              {languages.map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}
            </Select>
          </div>
          <Button onClick={translate}>Translate</Button>
          <Button onClick={handleVoiceInput} className="mt-2">Voice Input</Button>
          {translatedText && (
            <div>
              <p className="font-bold">Translated Text:</p>
              <p>{translatedText}</p>
              <Button onClick={handleVoiceOutput}>Listen</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4 w-full max-w-lg">
        <CardHeader>
          <CardTitle>Translation History</CardTitle>
        </CardHeader>
        <CardContent>
          {translationHistory.map((item, index) => (
            <div key={index} className="border-b pb-2 mb-2 last:border-b-0">
              <p><strong>From {item.from === 'auto' ? 'Auto' : languages.find(l => l.value === item.from)?.label} to {languages.find(l => l.value === item.to)?.label}</strong></p>
              <p>Original: {item.original}</p>
              <p>Translation: {item.translation}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <LanguageTranslator />
    </div>
  );
}