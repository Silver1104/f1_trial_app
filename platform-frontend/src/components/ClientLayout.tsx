'use client';

import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import NoSSR from '@/components/NoSSR';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <NoSSR 
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      }
    >
      <Navbar />
      <main>{children}</main>
    </NoSSR>
  );
}
