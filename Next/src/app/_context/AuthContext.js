'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useLocation } from '../_context/LocationContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setLocation } = useLocation();

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      localStorage.removeItem('user'); // clear any old user
      setLocation({ city: '', area: '', branchId: null });
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get('/userprofile');
      const userData = res.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); // ✅ Save user to localStorage

      if (userData.branch && userData.branch.length > 0) {
        const userBranch = userData.branch[0];
        const location = {
          city: userBranch.City || '',
          branchId: userBranch.BranchID || null,
          branchName: userBranch.BranchName || '',
          area: ''
        };
        setLocation(location);
        localStorage.setItem('selectedLocation', JSON.stringify(location));
      }
    } catch (error) {
      console.error('Fetch user failed:', error);
      setUser(null);
      localStorage.removeItem('user'); // ❗️Remove invalid user
      setLocation({ city: '', area: '', branchId: null });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ On first load: get from localStorage first to show immediately
  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      try {
        setUser(JSON.parse(localUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }

    fetchUser(); // revalidate from backend
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
