'use client';

import Image from 'next/image'
import Logo from '@/components/Logo';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import Navbar from '@/components/Navbar';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ArtiBot from '@/components/ArtiBot/ArtiBot';
import React, {useEffect, useState} from 'react';
import {AnimatePresence, useScroll, motion, useMotionValueEvent} from 'framer-motion';
import Snackbar from '@/components/Snackbar';

export default function Home() {


  return (
    <AnimatePresence mode={'wait'}>
      <motion.div className="fixed top-0 left-0 bg-background z-40 w-screen h-screen" initial={{'--tw-bg-opacity': 1, pointerEvents: 'all'}} animate={{'--tw-bg-opacity': 0, pointerEvents: 'none'}} transition={{delay: 0.35, type: 'tween', pointerEvents: {delay: 0.45} }}>
        <motion.div initial={{x: '-50%', y: '-50%', top: '50%', left: '50%'}} animate={{x: 0, y: 0, top: 15, left: 15}} transition={{type: 'spring', damping: 15, bounce: 0.15, delay: 0.2}} className="inline-block absolute">
          <div style={{width: 40, height: 40}}>
            <Logo width={'100%'} height={'100%'} />
          </div>
        </motion.div>
      </motion.div>
      <Navbar />
      <main>
        {/*<Logo />*/}
        <Hero />
        <Services />
        <WhyUs />
        <div id="arti-bot" className="bg-black py-20">
          <div className="landing-page-section px-0 md:px-10">
            <h2 className="text-3xl mb-10 px-10">Try Arti AI for free</h2>
            <ArtiBot miniVersion={true} containerClassName="rounded-xl border-2 border-primary" />
          </div>
        </div>
        <Contact />
        <Footer />
      </main>
    </AnimatePresence>
  )
}
