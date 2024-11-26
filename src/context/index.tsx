"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface AppContextType {
  name: string;
  setName: (name: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppWrapper = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState<string>("");
  return (
    <AppContext.Provider value={{ name, setName }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppWrapper");
  }
  return context;
}
