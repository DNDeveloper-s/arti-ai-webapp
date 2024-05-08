import { useState } from "react";
import { FaFunnelDollar } from "react-icons/fa";
import { FaConnectdevelop } from "react-icons/fa6";
import { GrDocumentSound } from "react-icons/gr";
import { HiMiniMegaphone } from "react-icons/hi2";

const videosUrl = [
  "/videos/ad-creation.mp4",
  "/videos/brand-voice.mp4",
  "/videos/brand-voice.mp4",
  "/videos/deploy.mp4",
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
      className="landing-page-section py-20 md:py-40 flex gap-6 flex-col md:flex-row"
    >
      <div className="flex-1">
        <div
          className={
            "flex flex-col gap-2 py-4 border-l-2 pl-7 cursor-pointer " +
            (activeTab === 0 ? "border-primary" : "border-gray-700")
          }
          onClick={() => handleActive(0)}
        >
          <div className="flex items-center gap-2">
            <HiMiniMegaphone />
            <h2 className="text-xl font-semibold">Ad Creation</h2>
          </div>
          <p className="text-sm text-gray-400 tracking-wide leading-normal">
            Captivate your audience with visually stunning and compelling ads
            tailored to your brand and target audience.
          </p>
        </div>
        <div
          className={
            "flex flex-col gap-2 py-4 border-l-2 pl-7 cursor-pointer " +
            (activeTab === 1 ? "border-primary" : "border-gray-700")
          }
          onClick={() => handleActive(1)}
        >
          <div className="flex items-center gap-2">
            <FaFunnelDollar />
            <h2 className="text-xl font-semibold">
              Marketing Funnel Optimization
            </h2>
          </div>
          <p className="text-sm text-gray-400 tracking-wide leading-normal">
            Streamline your customer journey with a well-defined and optimized
            marketing funnel, from awareness to conversion.
          </p>
        </div>
        <div
          className={
            "flex flex-col gap-2 py-4 border-l-2 pl-7 cursor-pointer " +
            (activeTab === 2 ? "border-primary" : "border-gray-700")
          }
          onClick={() => handleActive(2)}
        >
          <div className="flex items-center gap-2">
            <GrDocumentSound />
            <h2 className="text-xl font-semibold">Brand Voice Development</h2>
          </div>
          <p className="text-sm text-gray-400 tracking-wide leading-normal">
            Define and refine your brand voice to create a consistent and
            authentic brand experience that resonates with your audience.
          </p>
        </div>
        <div
          className={
            "flex flex-col gap-2 py-4 border-l-2 pl-7 cursor-pointer " +
            (activeTab === 3 ? "border-primary" : "border-gray-700")
          }
          onClick={() => handleActive(3)}
        >
          <div className="flex items-center gap-2">
            <FaConnectdevelop />
            <h2 className="text-xl font-semibold">
              Omni-Platform Connectivity
            </h2>
          </div>
          <p className="text-sm text-gray-400 tracking-wide leading-normal">
            Seamlessly connect with all major platforms, including Meta, TikTok,
            and email marketing, to maximize your reach and impact.
          </p>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="flex justify-center items-center">
          <video autoPlay loop muted src={videosUrl[activeTab]}></video>
        </div>
      </div>
    </div>
  );
}
