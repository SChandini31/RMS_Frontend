import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const storedUserString = localStorage.getItem("user");
  const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
  const storedToken = localStorage.getItem("token");

  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);

  const login = (userData, authToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);