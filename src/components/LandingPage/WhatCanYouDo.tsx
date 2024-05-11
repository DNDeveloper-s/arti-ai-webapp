"use client";
import Lottie from "lottie-react";
import whatCanYouDoAnim from "@/assets/lottie/what-can-you-do.json";
import Typist from "react-typist-component";
import { useState } from "react";
import { colors } from "@/config/theme";

export default function WhatCanYouDo() {
  const [typistKey, setTypistKey] = useState(0);

  return (
    <div
      className="w-full"
      style={{
        background:
          "linear-gradient(0deg, rgba(237,2,235,0.31836484593837533) 0%, rgba(237,2,235,1) 52%, rgba(237,2,235,0.3379726890756303) 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-[90vw] max-w-[1100px] mx-auto md:py-0 flex md:flex-row flex-col-reverse gap-8 py-4 justify-between">
        <div className="flex-1 flex flex-col justify-center items-start">
          <h2 className="mb-4 md:mb-7 text-[25px] md:text-[40px] font-gilroyRegular">
            What can I do with Arti AI:
          </h2>
          <p className="font-gilroyBold text-[35px] md:text-[50px] text-white ">
            <Typist
              startDelay={0}
              cursor={
                <span
                  style={{
                    color: "white",
                  }}
                >
                  |
                </span>
              }
              typingDelay={100}
              loop={true}
              key={typistKey}
              onTypingDone={() => setTypistKey((c) => (c >= 3 ? 1 : c + 1))}
            >
              {[
                { text: "Facebook Ads", color: "#fff" },
                { text: "Tiktok Ads", color: "#fff" },
                { text: "Email Marketing", color: "#fff" },
                { text: "Google Ads", color: "#fff" },
              ].map(({ text: word, color }) => [
                <span
                  key={word}
                  className={
                    "font-gilroyBold text-[35px] md:text-[50px] text-white " +
                    word
                  }
                >
                  {word}
                </span>,
                <Typist.Delay key={word} ms={2000} />,
                <Typist.Backspace key={word} count={word.length} />,
              ])}
            </Typist>
          </p>
        </div>
        <div>
          <Lottie
            className={
              "w-[240px] h-[240px] md:w-[380px] md:h-[380px] mx-auto md:mx-0"
            }
            animationData={whatCanYouDoAnim}
            loop={true}
          />
        </div>
      </div>
    </div>
  );
}
