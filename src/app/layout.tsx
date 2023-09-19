'use client'

import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar';
import SnackbarContextProvider from '@/context/SnackbarContext';
import React from 'react';
import {getServerSession} from 'next-auth';
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {SessionProvider} from 'next-auth/react';

const metadata: Metadata = {
  title: 'Arti AI',
  description: 'Revolutionizing Advertising and Strategy Planning with Artificial Intelligence. Unleash the Power of AI',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <SnackbarContextProvider>
            <>
              {children}
              <div id='myportal' className="z-[999] fixed top-0 left-0" />
            </>
          </SnackbarContextProvider>
        </SessionProvider>

      </body>
    </html>
  )
}
