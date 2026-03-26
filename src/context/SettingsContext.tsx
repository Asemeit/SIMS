import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'USD' | 'KES' | 'EUR' | 'GBP';
export type RegionCode = 'Global' | 'North America' | 'Kenya' | 'Europe';
export type SubscriptionPlan = 'Starter' | 'Professional' | 'Enterprise';

interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

interface SettingsContextType {
  currency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  region: RegionCode;
  setRegion: (region: RegionCode) => void;
  subscriptionPlan: SubscriptionPlan;
  setSubscriptionPlan: (plan: SubscriptionPlan) => void;
}

const Currencies: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('sims-currency') as CurrencyCode) || 'USD';
  });

  const [region, setRegion] = useState<RegionCode>(() => {
    return (localStorage.getItem('sims-region') as RegionCode) || 'Global';
  });

  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>(() => {
    return (localStorage.getItem('sims-subscription-plan') as SubscriptionPlan) || 'Professional';
  });

  useEffect(() => {
    localStorage.setItem('sims-currency', currencyCode);
  }, [currencyCode]);

  useEffect(() => {
    localStorage.setItem('sims-region', region);
  }, [region]);

  useEffect(() => {
    localStorage.setItem('sims-subscription-plan', subscriptionPlan);
  }, [subscriptionPlan]);

  const value = {
    currency: Currencies[currencyCode],
    setCurrency: setCurrencyCode,
    region,
    setRegion,
    subscriptionPlan,
    setSubscriptionPlan
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
