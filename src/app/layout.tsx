import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar';
import SnackbarContextProvider from '@/context/SnackbarContext';
import React from 'react';

export const metadata: Metadata = {
  title: 'Arti AI',
  description: 'Revolutionizing Advertising and Strategy Planning with Artificial Intelligence. Unleash the Power of AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SnackbarContextProvider>
          {children}
        </SnackbarContextProvider>
      </body>
    </html>
  )
}
