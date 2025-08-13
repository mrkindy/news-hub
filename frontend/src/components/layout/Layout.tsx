import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { LayoutProps } from '../../types/layout';

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};