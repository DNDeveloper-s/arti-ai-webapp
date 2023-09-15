'use client';

import Logo from '@/components/Logo';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import Navbar from '@/components/Navbar';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ArtiBot from '@/components/ArtiBot/ArtiBot';
import React from 'react';
import {AnimatePresence, useScroll, motion, useMotionValueEvent} from 'framer-motion';
import LandingPage from '@/components/LandingPage';
import {useSession} from 'next-auth/react';
import AppLoader from '@/components/AppLoader';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const {data, status} = useSession();

  let jsx = <AppLoader />

  if(status === 'unauthenticated')  jsx = <LandingPage />

  if(status === 'authenticated')  jsx = <Dashboard />

  return (
    <AnimatePresence mode={'wait'}>
      {jsx}
    </AnimatePresence>
  )
}
