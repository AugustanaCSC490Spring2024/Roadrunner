import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext(null);

export default function AuthContextProvider({children}) {
  const [auth, setAuth] = useState('');
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}
