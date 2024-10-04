import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import QRCode from "qrcode.react";

function QRCodeGenerator() {
  const [selectedType, setSelectedType] = useState("url");
  const [inputData, setInputData] = useState("");
  const [generatedQR, setGeneratedQR] = useState(null);

  const handleGenerateQR = () => {
    setGeneratedQR(inputData);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setInputData("");
    setGeneratedQR(null);
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>Select a type and enter the details below:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select type:</label>
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="url">URL</option>
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="contact">Contact Info</option>
            </select>
          </div>

          {selectedType === "url" && (
            <InputField
              label="Website URL"
              placeholder="Enter website link"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            />
          )}

          {selectedType === "text" && (
            <InputField
              label="Message"
              placeholder="Enter message to encode"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            />
          )}

          {selectedType === "email" && (
            <>
              <InputField
                label="Email Address"
                placeholder="Enter email address"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
              />
              <InputField
                label="Email Subject"
                placeholder="Enter subject"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
              />
            </>
          )}

          {selectedType === "contact" && (
            <>
              <InputField
                label="Name"
                placeholder="Enter name"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
              />
              <InputField
                label="Phone Number"
                placeholder="Enter phone number"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
              />
              <InputField
                label="Email Address"
                placeholder="Enter email address"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
              />
            </>
          )}

          <button
            onClick={handleGenerateQR}
            className="w-full bg-blue-500 text-white py-2 rounded-md mt-4"
          >
            Generate QR Code
          </button>

          {generatedQR && (
            <div className="mt-6 flex justify-center">
              <QRCode value={generatedQR} size={128} />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">Enter the details to generate a custom QR code.</p>
        </CardFooter>
      </Card>
    </div>
  );
}

function InputField({ label, placeholder, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-md"
      />
    </div>
  );
}

export default QRCodeGenerator;