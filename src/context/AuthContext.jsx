import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  // on app load, check if user was already logged in
  useEffect(() => {
    const token    = localStorage.getItem('token');
    const role     = localStorage.getItem('role');
    const name     = localStorage.getItem('name');
    const userId   = localStorage.getItem('userId');

    if (token && role) {
      setUser({ token, role, name, userId });
    }
  }, []);

  const login = (data) => {
    // save to localStorage so it persists on refresh
    localStorage.setItem('token',  data.token);
    localStorage.setItem('role',   data.role);
    localStorage.setItem('name',   data.name);
    localStorage.setItem('userId', data.userId);
    setUser(data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook — use this in any component
export const useAuth = () => useContext(AuthContext);