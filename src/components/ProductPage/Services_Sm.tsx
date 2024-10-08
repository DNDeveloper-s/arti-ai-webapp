"use client";

import React, {
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  mobileServicesData,
  servicesData,
} from "@/constants/productPageData/services";
import { ChatGPTMessageObj } from "@/interfaces/IArtiBot";
import useMounted from "@/hooks/useMounted";
import {
  mockProductOverviewData as mock,
  screens,
  ViewScreen,
} from "@/constants/servicesData";
import { ArtiChatDemo } from "@/components/ProductPage/Services";
import Image from "next/image";
import IphoneImage from "@/assets/images/iphone_2.png";
import { useMotionValueEvent, useScroll } from "framer-motion";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { BiCaretUp } from "react-icons/bi";

interface Props {
  id: number;
  title: string;
  description: string;
  style?: any;
  handleIdInView?: (id: Props["id"]) => void;
  isInView?: boolean;
}

const ServiceCard: React.FC<Props> = ({
  isInView,
  id,
  title,
  description,
  handleIdInView = (id: Props["id"]) => {},
}) => {
  const [expand, setExpand] = useState(false);

  const nodeRef = useCallback(
    (node: any) => {
      if (node !== null) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // console.log('entries - ', entries);
                handleIdInView(id);
                entry.target.classList.add("animate-fadeInUp");
                // observer.unobserve(entry.target);
              } else {
                // entry.target.classList.remove('animate-fadeInUp');
              }
            });
          },
          {
            root: null,
            rootMargin: "0px",
            threshold: 0.8,
          }
        );
        observer.observe(node);
      }
    },
    [handleIdInView, id]
  );

  return (
    <div
      ref={nodeRef}
      data-id={id}
      className="w-screen h-screen bg-red-300 bg-opacity-0"
    />
  );
};

const ids = [1, 2, 3];
export default function Services_Sm() {
  const [idInView, setIdInView] = useState<Props["id"]>(1);
  const isMounted = useMounted();
  const [viewScreen, setViewScreen] = useState(ViewScreen.MOBILE);
  const mounted = useMounted();
  const iphoneImageRef = useRef<HTMLImageElement>(null);
  const { scrollY } = useScroll();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const intervalId = setInterval(() => {
      setIdInView((prev) => {
        if (prev === 3) return 1;
        return prev + 1;
      });
    }, 3000);
    intervalRef.current = intervalId;

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // useMotionValueEvent(scrollY, "change", (latest: number) => {
  //   if (!sectionRef.current) return;
  //   // Check the sectionRef which is MutableRefObject<HTMLDivElement>, how much is it from the scroll Top
  //   // if it is less than 0, then set the viewScreen to ViewScreen.MOBILE
  //   // if it is greater than 0 and less than 1, then set the viewScreen to ViewScreen.TABLET
  //   // if it is greater than 1, then set the viewScreen to ViewScreen.DESKTOP
  //   const fromTop = sectionRef.current.offsetTop;

  //   const scrolledInSection = latest - fromTop;

  //   if (scrolledInSection < 500) setIdInView(1);
  //   if (scrolledInSection > 500 && scrolledInSection < 1000) setIdInView(2);
  //   if (scrolledInSection > 1000) setIdInView(3);
  // });

  const mockMessages = useMemo(() => {
    return mock.messages.sort((a, b) => a.serialOrder - b.serialOrder);
  }, []);

  const mockAdCreativeMessages = useMemo(() => {
    return mock.adCreativeMessages.sort(
      (a, b) => a.serialOrder - b.serialOrder
    );
  }, []);

  const dimensions = useMemo(() => {
    if (!mounted)
      return {
        width: 100,
        height: 100,
      };

    if (!iphoneImageRef?.current)
      return {
        width: 100,
        height: 100,
      };

    const rect = iphoneImageRef.current.getBoundingClientRect();

    return {
      width: rect.width - 40,
      height: rect.height - 30,
    };
  }, [mounted]);

  return (
    <div
      className="landing-page-section p-0 relative"
      id={"services"}
      ref={sectionRef}
    >
      <div className="sticky top-[80px] flex flex-col left-0 w-screen h-screen">
        <div className="mt-6 absolute left-1/2 top-[-20px] bg-white">
          {/*{servicesData.cards.map(serviceItem => <ServiceCard handleIdInView={handleIdInView} isInView={idInView === serviceItem.id} key={serviceItem.title} {...serviceItem} />)}*/}
          {servicesData.cards.map((serviceItem) => (
            <div
              key={serviceItem.id}
              className="absolute top-0 left-1/2 w-[80vw] bg-black bg-opacity-40 backdrop-blur-[1px] transform -translate-x-1/2 flex flex-col items-center justify-center"
              style={{
                opacity: idInView === serviceItem.id ? 1 : 0,
              }}
            >
              <div>
                <h1 className="text-[33px] text-center text-white leading-[38px] font-diatype font-medium">
                  {serviceItem.title}
                </h1>
                {/*<p className="font-gilroyRegular text-white text-opacity-40 mt-1 text-[14px]">{serviceItem.description.slice(0, 50)}</p>*/}
              </div>
            </div>
          ))}
        </div>
        <div
          data-groupid={"landing-section"}
          data-section={"product_overview"}
          className="relative lg:sticky h-[70vh] lg:h-screen top-[100px] flex flex-col gap-3 justify-center items-center"
        >
          <div className="text-left w-[90vw] h-full flex items-center justify-center relative">
            <div
              className={
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[550px] flex justify-center items-center h-full"
              }
            >
              <Image
                className="w-auto h-full max-w-none"
                src={IphoneImage}
                ref={iphoneImageRef}
                alt="Iphone Image"
              />
              <ArtiChatDemo.Chat
                sm={true}
                dimensions={dimensions}
                messages={mockMessages}
                viewScreen={viewScreen}
                isInView={idInView === 1}
              />
              <ArtiChatDemo.AdCreative
                sm={true}
                dimensions={dimensions}
                messages={mockAdCreativeMessages}
                viewScreen={viewScreen}
                isInView={idInView === 2}
              />
              <ArtiChatDemo.Metrics
                sm={true}
                dimensions={dimensions}
                messages={mockAdCreativeMessages}
                viewScreen={viewScreen}
                isInView={idInView === 3}
              />
            </div>
          </div>
        </div>
      </div>
      {/*{servicesData.cards.map(serviceItem => <ServiceCard handleIdInView={handleIdInView} isInView={idInView === serviceItem.id} key={serviceItem.title} {...serviceItem} />)}*/}
      {/* <div className="w-screen h-screen bg-red-300 bg-opacity-0" />
      <div className="w-screen h-screen bg-red-300 bg-opacity-0" /> */}
    </div>
  );
}
