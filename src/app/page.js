"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Country, State } from "country-state-city"; // Library for fetching states
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";

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
    <Box display="flex" height="100vh">
      {/* Country List Section */}
      <Box
        width="40%"
        borderRight={1}
        borderColor="divider"
        display="flex"
        flexDirection="column"
      >
        {/* Fixed Heading */}
        <Box
          position="sticky"
          top={0}
          bgcolor="background.paper"
          zIndex={1}
          p={2}
          // borderBottom={1}
        >
          <Typography variant="h6" gutterBottom>
            Countries
          </Typography>
        </Box>

        {/* Scrollable Country List */}
        <Box flex={1} overflow="auto" className="custom-scrollbar">
          <List>
            {countries.map((country) => (
              <Box key={country.value} border={1}>
                <ListItem
                  button
                  key={country.value}
                  onClick={() => handleCountryClick(country)}
                  selected={selectedCountry.isoCode === country.value}
                  sx={{
                    bgcolor:
                      selectedCountry.isoCode === country.value
                        ? "warning.light"
                        : "transparent",
                    "&:hover": {
                      bgcolor:
                        selectedCountry.isoCode === country.value
                          ? "warning.light"
                          : "grey.100",
                    },
                  }}
                >
                  <ListItemText
                    primary={country.label}
                    sx={{
                      color:
                        selectedCountry.isoCode === country.value
                          ? "primary.main"
                          : "text.primary",
                      fontWeight:
                        selectedCountry.isoCode === country.value
                          ? "bold"
                          : "normal",
                    }}
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        </Box>
      </Box>

      {/* States Section */}
      <Box width="60%" display="flex" flexDirection="column">
        {/* Fixed Heading */}
        <Box
          position="sticky"
          top={0}
          bgcolor="background.paper"
          zIndex={1}
          p={2}
          // borderBottom={1}
        >
          <Typography variant="h6" gutterBottom>
            States in {selectedCountry.name}
          </Typography>
        </Box>

        {/* Scrollable State List */}
        <Box flex={1} overflow="auto" className="custom-scrollbar">
          <List>
            {states.length > 0 ? (
              states.map((state) => (
                <Box key={state.isoCode} border={1}>
                  <ListItem>
                    <ListItemText primary={state.name} />
                    <Divider />
                  </ListItem>
                </Box>
              ))
            ) : (
              <Typography>No states available</Typography>
            )}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default CountryList;
