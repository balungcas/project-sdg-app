import { useContext } from 'react';
import { SDGContext, SDGContextType } from '@/context/SDGContext';

export const useSDGs = (): SDGContextType => {
  return useContext(SDGContext) as SDGContextType;
};