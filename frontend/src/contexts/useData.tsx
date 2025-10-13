import { useContext } from 'react';
import DataContext from './DataContext.context';

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};

export default useData;
