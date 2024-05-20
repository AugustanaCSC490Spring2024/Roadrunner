import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
  const [currUsername, setCurrUsername] = useState("");
  const [auth, setAuth] = useState({});

  // Load auth on initial render
  useEffect(() => {
    const loadAuthData = async () => {
      const storedAuth = await AsyncStorage.getItem("auth");
      if (storedAuth) {
        setAuth(JSON.parse(storedAuth));
      }
    };
    loadAuthData();
  }, []);

  // Save auth when it changes
  useEffect(() => {
    const saveAuthData = async () => {
      await AsyncStorage.setItem("auth", JSON.stringify(auth));
    };
    saveAuthData();
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, currUsername, setCurrUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
}
