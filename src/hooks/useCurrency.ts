import { useCallback } from 'react';

export const useCurrency = () => {
  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);

  const parseCurrency = useCallback((value: string): number => {
    // Remove all non-numeric characters except comma and dot
    const cleanValue = value.replace(/[^\d,.-]/g, '');
    
    // Replace comma with dot for parsing
    const normalizedValue = cleanValue.replace(',', '.');
    
    return parseFloat(normalizedValue) || 0;
  }, []);

  const formatNumber = useCallback((value: number, decimals: number = 2): string => {
    return value.toFixed(decimals).replace('.', ',');
  }, []);

  return {
    formatCurrency,
    parseCurrency,
    formatNumber
  };
};