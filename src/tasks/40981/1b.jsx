import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  Textarea 
} from "@/components/ui/shadcn-ui";

function QRCodeGenerator() {
  const [selectedType, setSelectedType] = useState('url');
  const [inputValue, setInputValue] = useState({
    url: '',
    text: '',
    email: '',
    subject: '',
    name: '',
    phone: '',
    emailContact: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue(prev => ({ ...prev, [name]: value }));
  };

  const getQRValue = () => {
    switch (selectedType) {
      case 'url':
        return inputValue.url;
      case 'text':
        return inputValue.text;
      case 'email':
        return `mailto:${inputValue.email}?subject=${encodeURIComponent(inputValue.subject)}`;
      case 'contact':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${inputValue.name}\nTEL:${inputValue.phone}\nEMAIL:${inputValue.emailContact}\nEND:VCARD`;
      default:
        return '';
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 sm:mt-20">
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
        <CardDescription>Select type and enter details</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <SelectItem value="url">URL</SelectItem>
          <SelectItem value="text">Text</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="contact">Contact</SelectItem>
        </Select>
        {selectedType === 'url' && (
          <Input name="url" placeholder="Enter URL" onChange={handleChange} value={inputValue.url} className="mt-4" />
        )}
        {selectedType === 'text' && (
          <Textarea name="text" placeholder="Enter Text" onChange={handleChange} value={inputValue.text} className="mt-4" />
        )}
        {selectedType === 'email' && (
          <>
            <Input name="email" placeholder="Enter Email" onChange={handleChange} value={inputValue.email} className="mt-4" />
            <Input name="subject" placeholder="Enter Subject" onChange={handleChange} value={inputValue.subject} className="mt-4" />
          </>
        )}
        {selectedType === 'contact' && (
          <>
            <Input name="name" placeholder="Name" onChange={handleChange} value={inputValue.name} className="mt-4" />
            <Input name="phone" placeholder="Phone" onChange={handleChange} value={inputValue.phone} className="mt-4" />
            <Input name="emailContact" placeholder="Email" onChange={handleChange} value={inputValue.emailContact} className="mt-4" />
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {getQRValue() && (
          <QRCode value={getQRValue()} size={128} level={"H"} className="mt-4" />
        )}
      </CardFooter>
    </Card>
  );
}

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <QRCodeGenerator />
    </div>
  );
}