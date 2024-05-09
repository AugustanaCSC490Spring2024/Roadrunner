import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export default function MyApp({children}) {
  const [auth, setAuth] = useState('');
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}
