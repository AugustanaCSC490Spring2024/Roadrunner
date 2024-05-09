import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export default function AuthContextProvider({children}) {
  const [currentUser, setCurrentUser] = useState('');
  return (
    <AuthContext.Provider  value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}
