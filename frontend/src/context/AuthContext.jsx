import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Set default API key header and baseURL globally for all backend calls
  axios.defaults.headers.common['x-api-key'] = import.meta.env.VITE_API_KEY || '';
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('rentease_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('rentease_token') || '';
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('rentease_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('rentease_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('rentease_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rentease_user');
    }
  }, [user]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const requestUrl = error.config?.url || '';
          const isAuthRoute = requestUrl.includes('/api/auth/login') || requestUrl.includes('/api/auth/register');
          if (!isAuthRoute) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    if (response.data) {
      setToken(response.data.accessToken);
      setUser({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      });
      return response.data;
    }
    throw new Error('Login failed');
  };

  const register = async (name, email, password) => {
    const response = await axios.post('/api/auth/register', { name, email, password });
    if (response.data) {
      setToken(response.data.accessToken);
      setUser({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      });
      return response.data;
    }
    throw new Error('Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('rentease_cart'); // Clear cart on logout
    window.location.href = '/login';
  };

  const isAdmin = () => {
    return user && (user.role === 'admin' || user.role === 'vendor');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAdmin, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
