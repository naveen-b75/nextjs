'use client';
import { createContext, useContext, useState } from 'react';

// Create the context
const UserContext = createContext();

// Create a custom hook to use the context
export function useUserContext() {
  return useContext(UserContext);
}

// Create a context provider component
export function UserProvider({ children }) {
  const [updateCart, setUpdateCart] = useState(false);

  // Render the user context provider once loading is false
  return (
    <UserContext.Provider value={{ updateCart, setUpdateCart }}>{children}</UserContext.Provider>
  );
}
