import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const languages = ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Hindi', 'Portuguese'];

// Mock translation function for demo purposes
const mockTranslations = {
  English: {
    Spanish: 'Texto traducido',
    French: 'Texte traduit',
    German: 'Übersetzter Text',
    Mandarin: '翻译的文本',
    Japanese: '翻訳されたテキスト',
    Hindi: 'अनुवादित पाठ',
    Portuguese: 'Texto traduzido',
  },
  Spanish: {
    English: 'Translated text',
    French: 'Texte traduit',
    German: 'Übersetzter Text',
    Mandarin: '翻译的文本',
    Japanese: '翻訳されたテキスト',
    Hindi: 'अनुवादित पाठ',
    Portuguese: 'Texto traduzido',
  },
  // Add other language translations as needed
};

// Mapping of language names to speech synthesis language codes
const languageCodeMap = {
  English: 'en-US',
  Spanish: 'es-ES',
  French: 'fr-FR',
  German: 'de-DE',
  Mandarin: 'zh-CN',
  Japanese: 'ja-JP',
  Hindi: 'hi-IN',
  Portuguese: 'pt-PT',
};

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

function VoiceInput({ onVoiceInput }) {
  const handleVoice = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      onVoiceInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  return (
    <button
      onClick={handleVoice}
      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-4"
    >
      Voice Input
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
  const [darkMode, setDarkMode] = useState(false);

  const handleTranslate = () => {
    // Simulate translation by looking up in mockTranslations object
    const translation = mockTranslations[sourceLanguage]?.[targetLanguage] || inputText;
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

  const handleVoiceInput = (text) => {
    setInputText(text);
  };

  const handleTextToSpeech = () => {
    if (!translatedText) return;
    
    const speech = new SpeechSynthesisUtterance(translatedText);
    const langCode = languageCodeMap[targetLanguage] || 'en-US'; // Fallback to 'en-US' if language code not found
    speech.lang = langCode;

    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Language Translator</CardTitle>
          <CardDescription>
            Effortlessly translate text between multiple languages with additional voice input/output.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium">Input Text</label>
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
          <VoiceInput onVoiceInput={handleVoiceInput} />
          <TranslateButton onClick={handleTranslate} />
          {translatedText && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow">
              <p className="text-lg font-semibold">Translated Text</p>
              <p>{translatedText}</p>
              <button
                onClick={handleTextToSpeech}
                className="bg-indigo-500 text-white py-1 px-3 rounded-lg hover:bg-indigo-600 mt-4"
              >
                Listen to Translation
              </button>
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

      <div className="flex justify-center mt-4">
        <button
          className="bg-purple-500 text-white py-1 px-3 rounded-lg hover:bg-purple-600"
          onClick={() => setDarkMode(!darkMode)}
        >
          Toggle Dark Mode
        </button>
      </div>

      <TranslationHistory history={history} />
    </div>
  );
}

export default App;
