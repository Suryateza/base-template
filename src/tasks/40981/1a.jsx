import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Simulating QR Code Generation
const generateQRCode = (data) => `QRCode: ${JSON.stringify(data)}`;

const QRCodeDisplay = ({ data }) => (
  <Card className="mt-4">
    <CardContent>
      <pre className="bg-gray-100 p-4 rounded text-sm">{data}</pre>
    </CardContent>
  </Card>
);

const SelectType = ({ value, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectItem value="url">URL</SelectItem>
    <SelectItem value="text">Text</SelectItem>
    <SelectItem value="email">Email</SelectItem>
    <SelectItem value="contact">Contact Information</SelectItem>
  </Select>
);

const DynamicFields = ({ type, state, setState }) => {
  const commonProps = { className: "mb-4" };

  switch (type) {
    case 'url':
      return <Input {...commonProps} placeholder="Enter URL" value={state.url} onChange={(e) => setState({...state, url: e.target.value})} />;
    case 'text':
      return <Input {...commonProps} placeholder="Enter text" value={state.text} onChange={(e) => setState({...state, text: e.target.value})} />;
    case 'email':
      return (
        <>
          <Input {...commonProps} placeholder="Enter email" value={state.email} onChange={(e) => setState({...state, email: e.target.value})} />
          <Input {...commonProps} placeholder="Enter subject" value={state.subject} onChange={(e) => setState({...state, subject: e.target.value})} />
        </>
      );
    case 'contact':
      return (
        <>
          <Input {...commonProps} placeholder="Name" value={state.name} onChange={(e) => setState({...state, name: e.target.value})} />
          <Input {...commonProps} placeholder="Phone" value={state.phone} onChange={(e) => setState({...state, phone: e.target.value})} />
          <Input {...commonProps} placeholder="Email" value={state.email} onChange={(e) => setState({...state, email: e.target.value})} />
        </>
      );
    default:
      return null;
  }
};

const InputForm = ({ onSubmit }) => {
  const [type, setType] = useState('url');
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type, ...formData });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate QR Code</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Label>Select Type</Label>
          <SelectType value={type} onChange={setType} />
          <DynamicFields type={type} state={formData} setState={setFormData} />
          <Button type="submit">Generate QR Code</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [qrData, setQRData] = useState(null);

  return (
    <div className="container mx-auto p-4 sm:max-w-lg">
      <InputForm onSubmit={(data) => setQRData(generateQRCode(data))} />
      {qrData && <QRCodeDisplay data={qrData} />}
    </div>
  );
}