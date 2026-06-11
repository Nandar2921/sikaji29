'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type FontSize = 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  arabicFontSize: FontSize;
  setArabicFontSize: (size: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>('text-base');
  const [arabicFontSize, setArabicFontSize] = useState<FontSize>('text-2xl');

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize, arabicFontSize, setArabicFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (!context) throw new Error('useFontSize must be used within FontSizeProvider');
  return context;
}