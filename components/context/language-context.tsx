'use client';

import React, { createContext, useContext } from 'react';
import { useSettings } from './settings-context';

interface LanguageContextType {
  showGermanTerms: boolean;
  setShowGermanTerms: (show: boolean) => Promise<boolean>;
  getTermFor: (germanTerm: string, englishTerm: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  showGermanTerms: true,
  setShowGermanTerms: async () => false,
  getTermFor: (germanTerm) => germanTerm,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { settings, updateSetting } = useSettings();

  const setShowGermanTerms = async (show: boolean): Promise<boolean> => {
    try {
      await updateSetting('show_german_terms', show);
      return show;
    } catch (error) {
      throw error;
    }
  };

  const getTermFor = (germanTerm: string, englishTerm: string): string => {
    return settings.show_german_terms ? germanTerm : englishTerm;
  };

  return (
    <LanguageContext.Provider
      value={{
        showGermanTerms: settings.show_german_terms,
        setShowGermanTerms,
        getTermFor,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
