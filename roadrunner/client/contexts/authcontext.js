import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export default function AuthContextProvider({children}) {
  const [currUsername, setCurrUsername] = useState('')
  const [auth, setAuth] = useState({});
  return (
    <AuthContext.Provider  value={{ auth, setAuth, currUsername, setCurrUsername }}>
      {children}
    </AuthContext.Provider>
  )
}
