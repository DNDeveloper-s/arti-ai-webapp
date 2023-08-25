import Image from 'next/image'
import Logo from '@/components/Logo';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import Navbar from '@/components/Navbar';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/*<Logo />*/}
        <Hero />
        <Services />
        <WhyUs />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
