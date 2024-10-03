import React, { useState } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";

// Mock data for demonstration
const mockCountryData = {
  "France": {
    flag: "🇫🇷",
    capital: "Paris",
    population: "67 million",
    languages: "French",
    currency: "Euro",
    facts: "France is famous for the Eiffel Tower and its cheeses."
  },
  // Add more countries as needed
};

function SearchBar({ onSearch }) {
  const [countryName, setCountryName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(countryName);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <Input 
        type="text" 
        value={countryName} 
        onChange={(e) => setCountryName(e.target.value)}
        placeholder="Enter country name"
        className="flex-grow"
      />
      <Button type="submit">Search</Button>
    </form>
  );
}

function CountryInfoCard({ data }) {
  if (!data) return <div>Enter a country name to get started!</div>;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{data.flag} {Object.keys(mockCountryData).find(key => mockCountryData[key] === data)}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <p><strong>Capital:</strong> {data.capital}</p>
          <p><strong>Population:</strong> {data.population}</p>
          <p><strong>Languages:</strong> {data.languages}</p>
          <p><strong>Currency:</strong> {data.currency}</p>
          <p><strong>Interesting Fact:</strong> {data.facts}</p>
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [countryData, setCountryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCountry = (countryName) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const lowerCaseName = countryName.toLowerCase();
      const data = mockCountryData[Object.keys(mockCountryData).find(key => key.toLowerCase() === lowerCaseName)];
      if (data) {
        setCountryData(data);
      } else {
        setError("Country not found. Please try another name.");
        setCountryData(null);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Country Information</h1>
      <SearchBar onSearch={fetchCountry} />
      {isLoading ? <p className="text-center mt-4">Loading...</p> : 
       error ? <p className="text-red-500 text-center mt-4">{error}</p> : 
       <CountryInfoCard data={countryData} />}
    </div>
  );
}