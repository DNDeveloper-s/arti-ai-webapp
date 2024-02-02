'use client';

import './globals.css'
import type { Metadata } from 'next'
import SnackbarContextProvider from '@/context/SnackbarContext';
import React from 'react';
import {SessionProvider} from 'next-auth/react';
import {ConversationContextProvider, initConversationState} from '@/context/ConversationContext';
import { Analytics } from '@vercel/analytics/react';
import {EditVariantContextProvider} from '@/context/EditVariantContext';

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
    <html lang="en" className="dark">
      <body className="bg-black">
        <SessionProvider>
          <SnackbarContextProvider>
            <ConversationContextProvider {...initConversationState}>
              <EditVariantContextProvider>
                <>
                  {children}
                  <div id='myportal' className="z-[999] fixed top-0 left-0" />
                </>
              </EditVariantContextProvider>
            </ConversationContextProvider>
          </SnackbarContextProvider>
        </SessionProvider>
        <Analytics />
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
