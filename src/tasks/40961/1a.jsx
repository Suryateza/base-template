import React, { useState } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

// Mock data for countries
const countriesData = {
  'France': {
    capital: 'Paris',
    population: 67000000,
    languages: ['French'],
    currency: 'Euro',
    flag: '🇫🇷',
    facts: ['Home to the Louvre Museum, the world’s largest art museum.']
  },
  // Add more countries as needed
};

const SearchBar = ({ onSearch }) => {
  const [country, setCountry] = useState('');

  return (
    <div className="flex items-center justify-center mb-4">
      <Input 
        value={country} 
        onChange={(e) => setCountry(e.target.value)} 
        placeholder="Enter a country name"
        className="mr-2"
      />
      <Button onClick={() => onSearch(country)}>Search</Button>
    </div>
  );
};

const FactCard = ({ title, content }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{content}</p>
    </CardContent>
  </Card>
);

const CountryInfo = ({ countryData }) => {
  if (!countryData) return <p>No country selected or found.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{countryData.flag} {Object.keys(countriesData).find(key => countriesData[key] === countryData)}</h2>
      <FactCard title="Capital" content={countryData.capital} />
      <FactCard title="Population" content={countryData.population.toLocaleString()} />
      <FactCard title="Languages" content={countryData.languages.join(', ')} />
      <FactCard title="Currency" content={countryData.currency} />
      <FactCard title="Interesting Fact" content={countryData.facts[0]} />
    </div>
  );
};

export default function App() {
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (countryName) => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setSearchResult(countriesData[countryName] || null);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Country Information</h1>
      <SearchBar onSearch={handleSearch} />
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <CountryInfo countryData={searchResult} />
      )}
    </div>
  );
}