import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for languages
const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', value: 'French' },
  { value: 'de', label: 'German' },
  // Add more languages as needed
];

function Translator() {
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');

  const handleTranslate = () => {
    // Here would be the actual translation logic with an API call
    // For this example, we'll just return a mock translation
    setTranslatedText(`[Translated to ${languages.find(lang => lang.value === targetLang).label}:] ${text}`);
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 p-4 sm:p-6">
      <CardHeader>
        <CardTitle>Language Translator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input 
          type="text" 
          placeholder="Enter text to translate" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
        />
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Select onValueChange={setSourceLang}>
            <SelectTrigger className="w-full sm:w-1/2">
              <SelectValue placeholder="Source Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setTargetLang}>
            <SelectTrigger className="w-full sm:w-1/2">
              <SelectValue placeholder="Target Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleTranslate}>Translate</Button>
        {translatedText && (
          <div className="mt-4 p-2 bg-secondary rounded-lg">
            <p>{translatedText}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background p-4">
      <Translator />
      <footer className="text-center mt-8 text-sm text-muted-foreground">
        <p>Happy translating! For help, check the help section.</p>
      </footer>
    </div>
  );
}