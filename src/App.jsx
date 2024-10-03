import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectItem, 
  Button, 
  Label, 
  Input 
} from "@/components/ui";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-8">BMI & BMR Calculator</h1>
      <div className="space-y-4 w-full max-w-lg">
        <CalculatorCard />
        <ResultsCard />
        <BmiCategoriesCard />
      </div>
    </div>
  );
}

function CalculatorCard() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activity: 'sedentary'
  });
  const [errors, setErrors] = useState({});
  const [bmr, setBmr] = useState(null);
  const [bmi, setBmi] = useState(null);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.weight) newErrors.weight = 'Weight is required';
    if (!formData.height) newErrors.height = 'Height is required';
    if (!formData.age) newErrors.age = 'Age is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = () => {
    if (!validateForm()) return;

    const { weight, height, age, gender, activity } = formData;
    const heightInMeters = height / 100;
    
    // BMI Calculation
    const bmiValue = weight / (heightInMeters * heightInMeters);
    setBmi(bmiValue.toFixed(2));

    // BMR Calculation using Harris-Benedict Equation
    let bmrValue;
    if (gender === 'male') {
      bmrValue = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmrValue = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    // Adjust BMR based on activity level
    switch(activity) {
      case 'sedentary': bmrValue *= 1.2; break;
      case 'light': bmrValue *= 1.375; break;
      case 'moderate': bmrValue *= 1.55; break;
      case 'active': bmrValue *= 1.725; break;
      case 'veryActive': bmrValue *= 1.9; break;
    }
    setBmr(Math.round(bmrValue));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculate BMI & BMR</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input 
            type="number" 
            placeholder="Weight (kg)" 
            value={formData.weight} 
            onChange={(e) => setFormData({...formData, weight: e.target.value})} 
            className={errors.weight ? 'border-red-500' : ''}
          />
          <Input 
            type="number" 
            placeholder="Height (cm)" 
            value={formData.height} 
            onChange={(e) => setFormData({...formData, height: e.target.value})} 
            className={errors.height ? 'border-red-500' : ''}
          />
          <Input 
            type="number" 
            placeholder="Age" 
            value={formData.age} 
            onChange={(e) => setFormData({...formData, age: e.target.value})} 
            className={errors.age ? 'border-red-500' : ''}
          />
          <Select 
            value={formData.gender} 
            onValueChange={(value) => setFormData({...formData, gender: value})}
          >
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </Select>
          <Select 
            value={formData.activity} 
            onValueChange={(value) => setFormData({...formData, activity: value})}
          >
            <SelectItem value="sedentary">Sedentary</SelectItem>
            <SelectItem value="light">Light Exercise</SelectItem>
            <SelectItem value="moderate">Moderate Exercise</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="veryActive">Very Active</SelectItem>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={calculate}>Calculate</Button>
      </CardFooter>
    </Card>
  );
}

function ResultsCard() {
  const [results, setResults] = useState({bmi: null, bmr: null});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent>
        {results.bmi === null ? 
          <p>No results</p> :
          <>
            <p>BMI: {results.bmi}</p>
            <p>BMR: {results.bmr} calories/day</p>
          </>
        }
      </CardContent>
    </Card>
  );
}

function BmiCategoriesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>BMI Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-800 text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">BMI Range</th>
                <th scope="col" className="px-6 py-3">Category</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="px-6 py-4">Below 18.5</td>
                <td className="px-6 py-4">Underweight</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-6 py-4">18.5 – 24.9</td>
                <td className="px-6 py-4">Normal weight</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-6 py-4">25 – 29.9</td>
                <td className="px-6 py-4">Overweight</td>
              </tr>
              <tr>
                <td className="px-6 py-4">30 and above</td>
                <td className="px-6 py-4">Obesity</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default App;