import { useContext } from 'react';
import { NewsContext } from '../context/NewsContext';
import { AuthContext } from '../context/AuthContext';
import { NewsContextType, AuthContextType } from '../types/context';

export const useNews = (): NewsContextType => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
