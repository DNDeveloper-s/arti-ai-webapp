"use client";
import React, { useEffect, useRef, useState } from "react";
import { whyUsData, WhyUsItem } from "@/constants/productPageData/whyUs/whyUs";
import { PiCaretRightBold } from "react-icons/pi";

interface WhyUsCardProps {
  item: WhyUsItem;
  expand: boolean;
  handleExpand: (groupId: number) => void;
  groupId: number;
}

const WhyUsCard: React.FC<WhyUsCardProps> = ({
  item,
  groupId,
  expand,
  handleExpand,
}) => {
  // const [expanded, setExpanded] = useState(null);
  const artiCardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<number>(0);

  function toggleExpand() {
    // setExpanded(c => !c);
    handleExpand(groupId);
  }

  // useEffect(() => {
  // 	setExpanded(expand);
  // }, [expand])

  useEffect(() => {
    if (!artiCardRef.current) return;

    // Calculate the mouse position relative to the container which is artiCardRef.current on mousemove
    const calculatePosition = (e) => {
      // Getting the dimensions of the container which is artiCardRef.current
      const rect = artiCardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return { x, y };
    };

    // Function to be called on mousemove
    const mouseMoveHandler = (e) => {
      const { x, y } = calculatePosition(e);
      setMousePos({ x, y });
    };

    // Function to be called on mouseleave
    const mouseLeaveHandler = () => {
      // artiCardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    };

    // Add event listeners
    artiCardRef.current.addEventListener("mousemove", mouseMoveHandler);
    artiCardRef.current.addEventListener("mouseleave", mouseLeaveHandler);

    const ref = artiCardRef.current;
    // Remove event listeners
    return () => {
      ref.removeEventListener("mousemove", mouseMoveHandler);
      ref.removeEventListener("mouseleave", mouseLeaveHandler);
    };
  }, []);

  return (
    <div
      className="arti-card cursor-pointer"
      ref={artiCardRef}
      style={{ "--mouse-x": `${mousePos.x}px`, "--mouse-y": `${mousePos.y}px` }}
    >
      <div
        className="p-6 relative h-full bg-gray-950 rounded-[inherit] z-20 overflow-hidden  font-diatype"
        onClick={toggleExpand}
      >
        <div className="z-50">
          {/*<div className="relative bg-secondaryText bg-opacity-25 rounded-2xl p-8 mb-10 md:mb-0 pt-14 font-diatype" onClick={toggleExpand}>*/}
          <PiCaretRightBold
            style={{ transform: `rotate(${expand ? -90 : 0}deg)` }}
            className="md:hidden transition-all absolute top-5 right-5"
          />
          {item.icon && (
            <div className="w-10 h-10 border border-gray-900 rounded-full flex justify-center items-center mb-4">
              <item.icon className="w-8 h-8 text-white fill-primary stroke-primary" />
            </div>
          )}
          <h4 className="font-bold z-10 text-lg mb-2">{item.title}</h4>
          <p className="relative text-sm leading-5 z-10 text-gray-400">
            {item.overview}
          </p>

          {item.readMore !== undefined && (
            <div className="overflow-hidden">
              <ul
                className="ml-[17px] max-h-0 pt-5 list-disc"
                style={{
                  maxHeight: expand ? "300px" : 0,
                  transition: ".3s ease-out",
                }}
              >
                {item.readMore.map((item) => (
                  <li key={item} className="mt-3">
                    <span className="text-sm leading-4 opacity-50">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TestimonialItemProps {
  item: {
    title: string;
  };
}

export default function WhyUs({ focusedSection }) {
  const ref = useRef<HTMLDivElement>(null);
  const [expandGroup, setExpandGroup] = useState<null | number>(null);

  function handleExpand(groupId: number) {
    setExpandGroup((c) => {
      if (c === groupId) return null;
      return groupId;
    });
  }

  useEffect(() => {
    if (!expandGroup || focusedSection === "why_us") return;
    setExpandGroup(null);
  }, [expandGroup, focusedSection]);

  return (
    <div
      className="landing-page-section relative py-16"
      id={"why-us"}
      ref={ref}
    >
      <div className={"block text-center w-full mb-6"}>
        <h3 className="landing-page-grad-title inline-block pl-0">Why Us</h3>
      </div>
      <div
        data-groupid={"landing-section"}
        data-section="why_us"
        className="max-w-[800px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {whyUsData.items.map((whyUsItem) => (
          <WhyUsCard
            key={whyUsItem.id}
            item={whyUsItem}
            expand={expandGroup === whyUsItem.groupId}
            handleExpand={handleExpand}
            groupId={whyUsItem.groupId ?? 1}
          />
        ))}
      </div>
    </div>
  );
}
