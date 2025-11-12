import React from 'react';
import { Toaster } from '@/components/ui/sonner';


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      
      {children}
      <Toaster position="top-right" richColors /> 
    </div>
  );
}
