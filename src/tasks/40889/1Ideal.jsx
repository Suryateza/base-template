import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const languages = ['English', 'Spanish', 'French', 'German', 'Mandarin'];

function LanguageSelector({ label, selectedLanguage, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value)}
      >
        {languages.map((language) => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>
    </div>
  );
}

function TranslateButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
    >
      Translate
    </button>
  );
}

function TranslationHistory({ history }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Translation History</h3>
      <ul className="list-disc pl-5">
        {history.map((entry, index) => (
          <li key={index}>
            {entry.input} ({entry.sourceLanguage}) -> {entry.output} ({entry.targetLanguage})
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [inputText, setInputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState(languages[0]);
  const [targetLanguage, setTargetLanguage] = useState(languages[1]);
  const [translatedText, setTranslatedText] = useState('');
  const [history, setHistory] = useState([]);

  const handleTranslate = () => {
    // Simulate a translation process
    const translation = `${inputText} translated to ${targetLanguage}`;
    setTranslatedText(translation);

    // Update history
    const newHistoryEntry = {
      input: inputText,
      sourceLanguage,
      targetLanguage,
      output: translation,
    };
    setHistory([newHistoryEntry, ...history]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Language Translator</CardTitle>
          <CardDescription>
            Translate text between multiple languages with ease.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Input Text</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows="4"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <LanguageSelector
            label="Source Language"
            selectedLanguage={sourceLanguage}
            onChange={setSourceLanguage}
          />
          <LanguageSelector
            label="Target Language"
            selectedLanguage={targetLanguage}
            onChange={setTargetLanguage}
          />
          <TranslateButton onClick={handleTranslate} />
          {translatedText && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow">
              <p className="text-lg font-semibold">Translated Text</p>
              <p>{translatedText}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <button
            className="bg-gray-500 text-white py-1 px-3 rounded-lg hover:bg-gray-600"
            onClick={() => setInputText('')}
          >
            Clear
          </button>
          <button
            className="bg-gray-500 text-white py-1 px-3 rounded-lg hover:bg-gray-600"
            onClick={() => navigator.clipboard.writeText(translatedText)}
          >
            Copy
          </button>
        </CardFooter>
      </Card>

      <TranslationHistory history={history} />
    </div>
  );
}

export default App;