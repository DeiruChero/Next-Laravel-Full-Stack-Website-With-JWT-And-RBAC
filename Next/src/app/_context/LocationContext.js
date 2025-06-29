'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({ city: '', branchId: null });

  // Initialize on load
  useEffect(() => {
    const storedLocation = localStorage.getItem('selectedLocation');
    if (storedLocation) {
      try {
        const parsed = JSON.parse(storedLocation);
        if (parsed.branchId) {
          setLocation(parsed);
        }
      } catch (e) {
        console.error("Invalid location in localStorage");
      }
    }
  }, []);

  // Save to localStorage every time location changes
  useEffect(() => {
    if (location && location.branchId) {
      localStorage.setItem('selectedLocation', JSON.stringify(location));
    }
  }, [location]);

  // New: Function to be called externally when user logs in
  const setUserLocationFromUser = (user) => {
    const branch = user?.branch?.[0];
    if (branch) {
      const newLoc = {
        city: branch.City || '',
        branchId: branch.BranchID || null,
      };
      setLocation(newLoc); // updates context and triggers localStorage sync
    }
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, setUserLocationFromUser }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
