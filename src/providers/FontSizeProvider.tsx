"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type FontSize = "sm" | "md" | "lg" | "xl";

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>("md");

  useEffect(() => {
    // Load saved font size from localStorage
    const savedFontSize = localStorage.getItem("fontSize") as FontSize;
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }
  }, []);

  useEffect(() => {
    // Save font size to localStorage
    localStorage.setItem("fontSize", fontSize);

    // Apply font size to the root element
    const root = document.documentElement;
    root.style.fontSize = {
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px",
    }[fontSize];
  }, [fontSize]);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return context;
};
