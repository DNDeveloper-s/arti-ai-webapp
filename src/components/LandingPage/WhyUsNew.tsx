import Lottie from "lottie-react";
import { useState } from "react";
import { FaFunnelDollar } from "react-icons/fa";
import { FaConnectdevelop } from "react-icons/fa6";
import { GrDocumentSound } from "react-icons/gr";
import { HiMiniMegaphone } from "react-icons/hi2";
import socialAnim from "@/assets/lottie/social.json";
import funnelAnim from "@/assets/lottie/funnel-1.json";
import startChatAnim from "@/assets/lottie/start-chat.json";
import socialPlatformsAnim from "@/assets/lottie/social-platforms.json";
import adDeploymentAnim from "@/assets/lottie/ad-deployment.json";

const videosUrl = [
  "/videos/ad-creation.mp4",
  "/videos/brand-voice.mp4",
  "/videos/brand-voice.mp4",
  "/videos/deploy.mp4",
];

const whyUsNewData = [
  {
    id: 1,
    title: "Ad Creation",
    description:
      "Captivate your audience with visually stunning and compelling ads tailored to your brand and target audience.",
    children: (
      <video
        className={"w-[260px] md:w-[320px] h-[260px] md:h-[320px]"}
        src="/videos/ad-creation.mp4"
        controls={false}
        autoPlay={true}
        loop={true}
        muted={true}
      ></video>
    ),
  },
  {
    id: 2,
    title: "Marketing Funnel Optimization",
    description:
      "Streamline your customer journey with a well-defined and optimized marketing funnel, from awareness to conversion.",
    children: (
      <Lottie
        className={"w-[230px] md:w-[300px] h-[230px] md:h-[300px]"}
        animationData={funnelAnim}
        loop={true}
      />
    ),
  },
  {
    id: 3,
    title: "Brand Voice Development",
    description:
      "Define and refine your brand voice to create a consistent and authentic brand experience that resonates with your audience.",
    children: (
      <Lottie
        className={"w-[230px] md:w-[300px] h-[230px] md:h-[300px]"}
        animationData={adDeploymentAnim}
        loop={true}
      />
    ),
  },
  {
    id: 4,
    title: "Omni-Platform Connectivity",
    description:
      "Seamlessly connect with all major platforms, including Meta, TikTok, and email marketing, to maximize your reach and impact.",
    children: (
      <Lottie
        className={"w-[230px] md:w-[300px] h-[230px] md:h-[300px]"}
        animationData={socialPlatformsAnim}
        loop={true}
      />
    ),
  },
  {
    id: 5,
    title: "Chat with AI",
    description:
      "Elevate your business with Arti, your AI-driven powerhouse for enhancing social media presence and innovative marketing.",
    children: (
      <Lottie
        className={"w-[230px] md:w-[300px] h-[230px] md:h-[300px]"}
        animationData={startChatAnim}
        loop={true}
      />
    ),
  },
];

export default function WhyUsNew() {
  const [activeTab, setActiveTab] = useState(0);

  const handleActive = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div
      id="why-us"
      data-groupid="landing-section"
      className="landing-page-section py-20 pb-40 !md:pb-0 md:py-40"
    >
      <div className="block text-center">
        <h3 className="landing-page-grad-title inline-block pl-0">Why Us</h3>
      </div>
      <div className="flex gap-6 flex-col md:flex-row">
        <div className="flex-1 w-full flex flex-col items-start gap-28 md:gap-16">
          {whyUsNewData.map((data, index) => (
            <div
              key={data.id}
              className={
                "flex w-full justify-between gap-5 md:gap-8 " +
                (index % 2 === 0
                  ? "flex-col md:flex-row"
                  : " flex-col md:flex-row-reverse")
              }
            >
              <div className="flex justify-center">{data.children}</div>
              <div
                className={
                  "flex-1 flex flex-col justify-center gap-2 py-4 pl-7 cursor-pointer items-center " +
                  (index % 2 === 0 ? "md:items-end" : "md:items-start ")
                }
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-[32px] md:text-[38px] font-semibold max-w-[450px]">
                      {data.title}
                    </h2>
                  </div>
                  <p className="text-[14px] md:text-[17px] text-gray-400 tracking-wide leading-normal max-w-[400px]">
                    {data.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
