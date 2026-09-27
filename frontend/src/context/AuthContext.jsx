import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const AuthContext = createContext(null);

const readAuthResponse = (response) => {
  const payload = response?.data || response;
  return {
    token: response?.accessToken || payload?.accessToken || response?.token,
    profile: response?.seller || payload?.user || payload,
  };
};

const readSavedProfile = () => {
  const token = localStorage.getItem('seller_token');
  const savedProfile = localStorage.getItem('seller_profile');
  if (
    !token ||
    token === 'undefined' ||
    !savedProfile ||
    savedProfile === 'undefined'
  ) {
    localStorage.removeItem('seller_token');
    localStorage.removeItem('seller_profile');
    return null;
  }

  try {
    return JSON.parse(savedProfile);
  } catch {
    localStorage.removeItem('seller_token');
    localStorage.removeItem('seller_profile');
    return null;
  }
};

export function AuthProvider({ children }) {
  const [seller, setSeller] = useState(readSavedProfile);
  const [loading, setLoading] = useState(false);

  const persist = (token, profile) => {
    localStorage.setItem('seller_token', token);
    localStorage.setItem('seller_profile', JSON.stringify(profile));
    setSeller(profile);
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', payload);
      const { token, profile } = readAuthResponse(data);
      if (!token)
        throw new Error('Registration response did not include a token.');
      persist(token, profile);
      toast.success('Account created. Welcome aboard!');
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Signup failed. Try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', payload);
      const { token, profile } = readAuthResponse(data);
      if (!token) throw new Error('Login response did not include a token.');
      persist(token, profile);
      toast.success(
        `Welcome back, ${profile?.shopName || profile?.userName || 'seller'}.`
      );
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid email or password.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('seller_token');
    localStorage.removeItem('seller_profile');
    setSeller(null);
  };

  return (
    <AuthContext.Provider value={{ seller, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
