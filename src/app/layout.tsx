"use client";

import "./globals.css";
import type { Metadata } from "next";
import SnackbarContextProvider from "@/context/SnackbarContext";
import React from "react";
import { SessionProvider, useSession } from "next-auth/react";
import {
  ConversationContextProvider,
  initConversationState,
} from "@/context/ConversationContext";
import { Analytics } from "@vercel/analytics/react";
import { EditVariantContextProvider } from "@/context/EditVariantContext";
import { UserContextProvider } from "@/context/UserContext";
import Providers from "./providers";
import { NextUIProvider } from "@nextui-org/react";
import { ConfigProvider, ThemeConfig, theme } from "antd";
import Snackbar from "@/components/Snackbar";
import { BusinessContextProvider } from "@/context/BusinessContext";

const metadata: Metadata = {
  title: "Arti AI",
  description:
    "Revolutionizing Advertising and Strategy Planning with Artificial Intelligence. Unleash the Power of AI",
};

const config: ThemeConfig = {
  token: {
    colorPrimary: "#ed02eb",
  },
  components: {
    Select: {
      controlHeight: 40,
    },
  },
  algorithm: theme.darkAlgorithm,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black">
        <NextUIProvider>
          <ConfigProvider theme={config}>
            <SessionProvider>
              <Providers>
                <UserContextProvider status="loading">
                  <SnackbarContextProvider>
                    <BusinessContextProvider>
                      <ConversationContextProvider {...initConversationState}>
                        <EditVariantContextProvider>
                          <>
                            {children}
                            <div
                              id="myportal"
                              className="z-[1000] fixed top-0 left-0"
                            />
                            <div
                              id="canvastoolsportal"
                              className="z-[1001] fixed top-0 left-0"
                            />
                            <div
                              id="contextmenuportal"
                              className="z-[1002] fixed top-0 left-0"
                            />
                            <Snackbar />
                          </>
                        </EditVariantContextProvider>
                      </ConversationContextProvider>
                    </BusinessContextProvider>
                  </SnackbarContextProvider>
                </UserContextProvider>
              </Providers>
            </SessionProvider>
          </ConfigProvider>
        </NextUIProvider>
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
  );
}
