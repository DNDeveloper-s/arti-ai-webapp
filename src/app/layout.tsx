'use client';

import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar';
import SnackbarContextProvider from '@/context/SnackbarContext';
import React from 'react';
import {getServerSession} from 'next-auth';
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {SessionProvider} from 'next-auth/react';
import Script from 'next/script';
import {ConversationContextProvider, initConversationState} from '@/context/ConversationContext';

const metadata: Metadata = {
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
        <SessionProvider>
          <SnackbarContextProvider>
            <ConversationContextProvider {...initConversationState}>
              <>
                {children}
                <div id='myportal' className="z-[999] fixed top-0 left-0" />
              </>
            </ConversationContextProvider>
          </SnackbarContextProvider>
        </SessionProvider>
        {/*<Script*/}
        {/*  id={"gtag"}*/}
        {/*  strategy={"afterInteractive"}*/}
        {/*  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID ?? "AW-11408559506"}`}*/}
        {/*/>*/}
        {/*<Script*/}
        {/*  id={"gtm-script"}*/}
        {/*  strategy={"afterInteractive"}*/}
        {/*  dangerouslySetInnerHTML={{*/}
        {/*    __html: `*/}
        {/*      window.dataLayer = window.dataLayer || [];*/}
        {/*      function gtag(){dataLayer.push(arguments);}*/}
        {/*      gtag('js', new Date());*/}
        {/*    */}
        {/*      gtag('config', 'AW-11408559506');*/}
        {/*    `*/}
        {/*  }}*/}
        {/*/>*/}
      </body>
    </html>
  )
}
