"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Car, Package, Check, X, RotateCw } from 'lucide-react';

const TrunkCalculator = () => {
  // Car database
  const cars = [
    { 
      id: 1, 
      brand: "Toyota", 
      model: "Camry", 
      year: "2024",
      trunk: { length: 100, width: 55, height: 45 }
    },
    { 
      id: 2, 
      brand: "Toyota", 
      model: "Corolla", 
      year: "2024",
      trunk: { length: 90, width: 52, height: 42 }
    },
    { 
      id: 3, 
      brand: "Honda", 
      model: "Civic", 
      year: "2024",
      trunk: { length: 95, width: 50, height: 40 }
    },
    { 
      id: 4, 
      brand: "Honda", 
      model: "Accord", 
      year: "2024",
      trunk: { length: 102, width: 57, height: 45 }
    },
    { 
      id: 5, 
      brand: "Tesla", 
      model: "Model 3", 
      year: "2024",
      trunk: { length: 98, width: 54, height: 43 }
    },
    { 
      id: 6, 
      brand: "BMW", 
      model: "3 Series", 
      year: "2024",
      trunk: { length: 105, width: 58, height: 45 }
    },
    { 
      id: 7, 
      brand: "Mercedes", 
      model: "C-Class", 
      year: "2024",
      trunk: { length: 103, width: 56, height: 44 }
    }
  ];

  // State definitions
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [item, setItem] = useState({ length: "", width: "", height: "" });
  const [result, setResult] = useState(null);

  // Get unique brands
  const brands = [...new Set(cars.map(car => car.brand))].sort();

  // Get models for selected brand
  const getModels = (brand) => {
    return [...new Set(cars
      .filter(car => car.brand === brand)
      .map(car => car.model))
    ].sort();
  };

  // Get years for selected brand and model
  const getYears = (brand, model) => {
    return [...new Set(cars
      .filter(car => car.brand === brand && car.model === model)
      .map(car => car.year))
    ].sort().reverse();
  };

  // Function to get user-friendly orientation description
  const getOrientationDescription = (original, rotated) => {
    const [origL, origW, origH] = original;
    const [rotL, rotW, rotH] = rotated;
    
    if (rotL === origL && rotW === origW && rotH === origH) {
      return "Place the item normally (as measured)";
    }
    
    if (rotL === origL && rotW === origH && rotH === origW) {
      return "Lay the item on its side";
    }
    
    if (rotL === origW && rotW === origL && rotH === origH) {
      return "Rotate the item 90° horizontally";
    }
    
    if (rotL === origW && rotW === origH && rotH === origL) {
      return "Rotate 90° horizontally and lay on its side";
    }
    
    if (rotL === origH && rotW === origL && rotH === origW) {
      return "Stand the item upright and rotate 90°";
    }
    
    if (rotL === origH && rotW === origW && rotH === origL) {
      return "Stand the item upright";
    }

    return "Alternative orientation possible";
  };

  // Function to check if item fits in any orientation
  const checkAllOrientations = (itemDims, trunkDims) => {
    const [l, w, h] = [Number(itemDims.length), Number(itemDims.width), Number(itemDims.height)];
    const originalDims = [l, w, h];
    
    // Generate all possible orientations
    const orientations = [
      [l, w, h], // normal
      [l, h, w], // lay on side
      [w, l, h], // rotate 90°
      [w, h, l], // rotate 90° and lay on side
      [h, l, w], // stand upright and rotate
      [h, w, l]  // stand upright
    ];

    // Check each orientation
    const fittingOrientations = orientations.filter(([length, width, height]) => 
      length <= trunkDims.length &&
      width <= trunkDims.width &&
      height <= trunkDims.height
    );

    // Add descriptions to fitting orientations
    const orientationsWithDescriptions = fittingOrientations.map(dims => ({
      dimensions: dims,
      description: getOrientationDescription(originalDims, dims)
    }));

    return {
      fits: orientationsWithDescriptions.length > 0,
      orientations: orientationsWithDescriptions,
      totalOrientations: orientationsWithDescriptions.length,
      bestOption: orientationsWithDescriptions[0]?.description
    };
  };

  const calculateFit = () => {
    if (!selectedCar || !item.length || !item.width || !item.height) {
      setResult(null);
      return;
    }

    const fitResult = checkAllOrientations(item, selectedCar.trunk);

    setResult({
      fits: fitResult.fits,
      message: fitResult.fits 
        ? `The item will fit in your trunk! ${
            fitResult.totalOrientations > 1 
              ? `(${fitResult.totalOrientations} possible positions)` 
              : ''
          }`
        : "The item won't fit in your trunk in any position.",
      orientations: fitResult.orientations,
      bestOption: fitResult.bestOption
    });
  };

  // Handle brand selection
  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setSelectedModel("");
    setSelectedYear("");
    setSelectedCar(null);
    setResult(null);
  };

  // Handle model selection
  const handleModelChange = (model) => {
    setSelectedModel(model);
    setSelectedYear("");
    setSelectedCar(null);
    setResult(null);
  };

  // Handle year selection
  const handleYearChange = (year) => {
    setSelectedYear(year);
    const car = cars.find(c => 
      c.brand === selectedBrand && 
      c.model === selectedModel && 
      c.year === year
    );
    setSelectedCar(car);
  };

  useEffect(() => {
    calculateFit();
  }, [selectedCar, item]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-6 h-6" />
            Trunk Space Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Car Selection Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Your Car</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={selectedBrand} onValueChange={handleBrandChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={selectedModel} 
                  onValueChange={handleModelChange}
                  disabled={!selectedBrand}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedBrand && getModels(selectedBrand).map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={selectedYear} 
                  onValueChange={handleYearChange}
                  disabled={!selectedModel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedModel && getYears(selectedBrand, selectedModel).map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Item Dimensions Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Package className="w-5 h-5" />
                Item Dimensions
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  type="number"
                  placeholder="Length (cm)"
                  value={item.length}
                  onChange={(e) => setItem({...item, length: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Width (cm)"
                  value={item.width}
                  onChange={(e) => setItem({...item, width: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Height (cm)"
                  value={item.height}
                  onChange={(e) => setItem({...item, height: e.target.value})}
                />
              </div>
            </div>

            {/* Results Section */}
            {result && (
              <Alert variant={result.fits ? "default" : "destructive"}>
                <AlertDescription className="flex items-center gap-2">
                  {result.fits ? (
                    <>
                      <Check className="w-4 h-4" />
                      {result.orientations.length > 1 && <RotateCw className="w-4 h-4 ml-2" />}
                    </>
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  {result.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Fitting Instructions */}
            {result?.fits && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="text-lg font-medium">
                  Best way to fit the item:
                  <div className="text-base font-normal mt-2 flex items-center gap-2">
                    <RotateCw className="w-5 h-5 text-blue-600" />
                    {result.bestOption}
                  </div>
                </div>

                {result.orientations.length > 1 && (
                  <div>
                    <h4 className="font-medium mb-2">Alternative positions:</h4>
                    <ul className="space-y-2">
                      {result.orientations.slice(1).map((orientation, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <RotateCw className="w-4 h-4 text-gray-500" />
                          {orientation.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Selected Car Details */}
            {selectedCar && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">
                  {selectedCar.brand} {selectedCar.model} {selectedCar.year} Trunk Dimensions:
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>Length: {selectedCar.trunk.length} cm</div>
                  <div>Width: {selectedCar.trunk.width} cm</div>
                  <div>Height: {selectedCar.trunk.height} cm</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrunkCalculator;
