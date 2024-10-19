import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userData, setUserData] = useState(() => {
    const userData = token ? jwtDecode(token) : null;
    return userData;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setUserData(token ? jwtDecode(token) : null);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    const userData = newToken ? jwtDecode(newToken) : null;
    setToken(newToken);
    setUserData(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserData(null);
  };

  return {token, userData, login, logout};
};

export default useAuth;
