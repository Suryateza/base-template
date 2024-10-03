import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

// Hardcoded country data
const countryDataList = [
  {
    name: "France",
    capital: "Paris",
    population: 67390000,
    languages: ["French"],
    currency: "Euro (EUR)",
    flag: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg",
    facts: "France is known for its wine, cuisine, and the Eiffel Tower.",
  },
  {
    name: "Japan",
    capital: "Tokyo",
    population: 125800000,
    languages: ["Japanese"],
    currency: "Yen (JPY)",
    flag: "https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg",
    facts:
      "Japan has a rich cultural heritage and is famous for its technology and cherry blossoms.",
  },
  {
    name: "Brazil",
    capital: "Brasilia",
    population: 213317639,
    languages: ["Portuguese"],
    currency: "Brazilian Real (BRL)",
    flag: "https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg",
    facts: "Brazil is the largest country in South America and famous for its Carnival festival.",
  },
  {
    name: "India",
    capital: "New Delhi",
    population: 1380004385,
    languages: ["Hindi", "English"],
    currency: "Indian Rupee (INR)",
    flag: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg",
    facts:
      "India is known for its diverse culture, spirituality, and is home to the iconic Taj Mahal.",
  },
  {
    name: "Canada",
    capital: "Ottawa",
    population: 38008005,
    languages: ["English", "French"],
    currency: "Canadian Dollar (CAD)",
    flag: "https://upload.wikimedia.org/wikipedia/en/c/cf/Flag_of_Canada.svg",
    facts:
      "Canada is famous for its natural landscapes, maple syrup, and being the second-largest country by land area.",
  },
  {
    name: "Australia",
    capital: "Canberra",
    population: 25687041,
    languages: ["English"],
    currency: "Australian Dollar (AUD)",
    flag: "https://upload.wikimedia.org/wikipedia/en/b/b9/Flag_of_Australia.svg",
    facts:
      "Australia is known for its diverse wildlife, the Great Barrier Reef, and the Outback.",
  },
  {
    name: "Germany",
    capital: "Berlin",
    population: 83166711,
    languages: ["German"],
    currency: "Euro (EUR)",
    flag: "https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg",
    facts:
      "Germany is a leader in engineering, and it's famous for its Oktoberfest and rich history.",
  },
  {
    name: "Mexico",
    capital: "Mexico City",
    population: 128932753,
    languages: ["Spanish"],
    currency: "Mexican Peso (MXN)",
    flag: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Mexico.svg",
    facts:
      "Mexico is known for its vibrant culture, cuisine, and being the origin of chocolate and avocados.",
  },
  {
    name: "Japan",
    capital: "Tokyo",
    population: 125800000,
    languages: ["Japanese"],
    currency: "Yen (JPY)",
    flag: "https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg",
    facts:
      "Japan has a rich cultural heritage and is famous for its technology and cherry blossoms.",
  },
  {
    name: "Brazil",
    capital: "Brasilia",
    population: 213317639,
    languages: ["Portuguese"],
    currency: "Brazilian Real (BRL)",
    flag: "https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg",
    facts: "Brazil is the largest country in South America and famous for its Carnival festival.",
  },
  // Add more countries here
];

export default function App() {
  const [countryName, setCountryName] = useState("");
  const [countryData, setCountryData] = useState(null);
  const [error, setError] = useState("");

  // Handle the search submission
  const handleSearch = (e) => {
    e.preventDefault();
    const foundCountry = countryDataList.find(
      (country) => country.name.toLowerCase() === countryName.toLowerCase()
    );
    if (foundCountry) {
      setCountryData(foundCountry);
      setError("");
    } else {
      setError("Country not found. Please try again.");
      setCountryData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-md p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search for a country
            </label>
            <input
              type="text"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              placeholder="Enter country name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </form>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {countryData && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{countryData.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <img
                src={countryData.flag}
                alt={`${countryData.name} flag`}
                className="w-20 h-12 object-contain"
              />
              <p>
                <strong>Capital:</strong> {countryData.capital}
              </p>
              <p>
                <strong>Population:</strong>{" "}
                {countryData.population.toLocaleString()}
              </p>
              <p>
                <strong>Languages:</strong> {countryData.languages.join(", ")}
              </p>
              <p>
                <strong>Currency:</strong> {countryData.currency}
              </p>
            </CardContent>
            <CardFooter className="text-sm text-gray-500">
              Interesting fact: {countryData.facts}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}