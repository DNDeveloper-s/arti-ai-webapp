"use client";

import Navbar from "@/components/ProductPage/Navbar";
import Hero from "@/components/LandingPage/Hero";
import WhyUs from "@/components/ProductPage/WhyUs";
import ArtiBot from "@/components/ArtiBot/ArtiBot";
import Contact from "@/components/ProductPage/Contact";
import Footer from "@/components/ProductPage/Footer";
import ScreenLoader from "@/components/ProductPage/ScreenLoader";
import { useEffect, useRef, useState } from "react";
import useAnalyticsClient from "@/hooks/useAnalyticsClient";
import { GTM_EVENT, logEvent } from "@/utils/gtm";
import BgAttachment from "@/components/ProductPage/BgAttachment";
import TryForFreeButton from "@/components/ProductPage/TryForFreeButton";
import Testimonials from "@/components/ProductPage/Testimonials";
import { useMediaQuery } from "react-responsive";
import dynamic from "next/dynamic";
const Services_Sm = dynamic(
  () => import("@/components/ProductPage/Services_Sm"),
  { ssr: false }
);
const Services = dynamic(() => import("@/components/ProductPage/Services"), {
  ssr: false,
});
// import Services from "@/components/ProductPage/Services";
// import Services_Sm from "@/components/ProductPage/Services_Sm";
import useMounted from "@/hooks/useMounted";
import Numbers from "@/components/LandingPage/Numbers";
import CaseStudies from "@/components/LandingPage/CaseStudies";
import ServiceIntroduction from "./ServiceIntroduction";
import WhyUsNew from "../LandingPage/WhyUsNew";

function calculateScrollDepth() {
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = window.innerHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
  return Math.round(scrollPercentage);
}

export default function ProductLandingPage() {
  const { clientId } = useAnalyticsClient();
  const timeoutRef = useRef<any>(0);
  const sectionLoggedRef = useRef<Map<string, boolean>>(new Map());
  const [showTryButton, setShowTryButton] = useState<boolean>(true);
  const [focusedSection, setFocusedSection] = useState<string>("");
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });
  const isPortrait = useMediaQuery({ orientation: "portrait" });
  const isMounted = useMounted();

  useEffect(() => {
    if (!clientId) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = (entry.target as HTMLElement).dataset.section;
          setFocusedSection(sectionIndex || "");

          if (sectionIndex === "hero" || sectionIndex === "arti_bot") {
            setShowTryButton(false);
          } else {
            setShowTryButton(true);
          }

          const isSectionLogged = sectionLoggedRef.current.get(sectionIndex);
          if (!isSectionLogged) {
            logEvent({
              event: GTM_EVENT.SCROLL_DEPTH,
              event_category: "Engagement",
              event_label: "Section Viewed",
              value: sectionIndex,
              client_identifier: clientId,
            });

            sectionLoggedRef.current.set(sectionIndex, true);
          }
          // Log your event or perform any other action here
        }
      });
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    const sections = document.querySelectorAll(
      'main [data-groupid="landing-section"]'
    );

    sections.forEach((section, index) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, [clientId]);

  return (
    <>
      <ScreenLoader />
      <Navbar />
      <main>
        {/*<Logo />*/}
        <Hero />
        <WhyUsNew />
        {isMounted && (isSmallScreen || isPortrait) ? (
          <Services_Sm />
        ) : (
          <Services />
        )}
        {isSmallScreen && <ServiceIntroduction />}
        <Numbers />
        <CaseStudies />
        <Testimonials />
        {/*<BgAttachment />*/}
        {/* <div
          data-groupid={"landing-section"}
          data-section="arti_bot"
          id="arti-bot"
          className="bg-black pt-8 pb-10"
        >
          <div className="landing-page-section px-0 md:px-10">
            <div className={"w-full text-center"}>
              <h2 className="landing-page-grad-title text-center inline-block">
                Try Arti AI for free
              </h2>
            </div>
            <ArtiBot
              borderAnimation={true}
              miniVersion={true}
              containerClassName="rounded-xl"
            />
          </div>
        </div> */}
        {/* <WhyUs focusedSection={focusedSection} /> */}
        <Contact />
        {showTryButton && <TryForFreeButton label={"Join Waitlist"} />}
        <Footer />
      </main>
    </>
  );
}

// https://www.artiai.org/artibot/ad_creative/656ec68f03b0997ed7c52c06?project_name=Baskin%27%20Coffee
