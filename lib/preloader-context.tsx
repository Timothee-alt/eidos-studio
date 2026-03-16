"use client";

import { createContext, useContext, useState, useCallback } from "react";

type PreloaderContextType = {
  isReady: boolean;
  setReady: () => void;
};

const PreloaderContext = createContext<PreloaderContextType | null>(null);

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const setReady = useCallback(() => setIsReady(true), []);
  return (
    <PreloaderContext.Provider value={{ isReady, setReady }}>
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloader() {
  const ctx = useContext(PreloaderContext);
  return ctx ?? { isReady: true, setReady: () => {} };
}
