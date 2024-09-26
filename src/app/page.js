"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Country, State } from "country-state-city"; // Library for fetching states

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "India",
    isoCode: "IN",
  });
  const [states, setStates] = useState([]);

  // Fetch countries from the REST API
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countryList = response.data.map((country) => ({
          label: country.name.common, // Using common name
          value: country.cca2, // Using ISO Alpha-2 code
        }));
        setCountries(countryList);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Fetch states for the selected country
  useEffect(() => {
    if (selectedCountry.isoCode) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(countryStates);
    }
  }, [selectedCountry]);

  // Handle country selection
  const handleCountryClick = (country) => {
    setSelectedCountry({ name: country.label, isoCode: country.value });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Country List Section */}
      <h2 className="text-xl font-semibold mb-4 fixed">Countries</h2>

      <div className="w-2/5 p-4 border-r mt-8 overflow-y-auto">
        <ul className="space-y-2">
          {countries.map((country) => (
            <li
              key={country.value}
              onClick={() => handleCountryClick(country)}
              className={`cursor-pointer p-3 rounded transition-colors duration-300 
                ${
                  selectedCountry.isoCode === country.value
                    ? "bg-blue-600 text-white font-bold"
                    : "bg-gray-200 hover:bg-gray-300"
                }
              `}
            >
              {country.label}
            </li>
          ))}
        </ul>
      </div>

      {/* States Section */}
      <h2 className="text-xl font-semibold mb-4 fixed left-[40%]">
        States in {selectedCountry.name}
      </h2>
      <div className="w-3/5 p-4 mt-8 overflow-y-auto">
        <ul className="space-y-2">
          {states.length > 0 ? (
            states.map((state) => (
              <li key={state.isoCode} className="p-2 border-b">
                {state.name}
              </li>
            ))
          ) : (
            <p>No states available</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CountryList;
