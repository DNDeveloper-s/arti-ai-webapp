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

export default function WhyUsNew() {
  const [activeTab, setActiveTab] = useState(0);

  const handleActive = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div
      id="why-us"
      data-groupid="landing-section"
      className="landing-page-section py-20 !pb-0 md:py-40 flex gap-6 flex-col md:flex-row"
    >
      <div className="flex-1 w-full flex flex-col items-start gap-6">
        <div className="flex w-full justify-between gap-8">
          <div
            className={
              "flex-1 flex flex-col justify-center gap-2 py-4 pl-7 cursor-pointer "
            }
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                {/* <HiMiniMegaphone className="text-[38px]" /> */}
                <h2 className="text-[38px] font-semibold">Ad Creation</h2>
              </div>
              <p className="text-[17px] text-gray-400 tracking-wide leading-normal max-w-[400px]">
                Captivate your audience with visually stunning and compelling
                ads tailored to your brand and target audience.
              </p>
            </div>
          </div>
          <div>
            <video
              className={"w-[380px] h-[380px]"}
              src="/videos/ad-creation.mp4"
              controls={false}
              autoPlay={true}
              loop={true}
              muted={true}
            ></video>
            {/* <Lottie
              className={"w-[380px] h-[380px]"}
              animationData={socialAnim}
              loop={true}
            /> */}
          </div>
        </div>
        <div className="flex w-full justify-between gap-8">
          <div>
            <Lottie
              className={"w-[300px] h-[300px]"}
              animationData={funnelAnim}
              loop={true}
            />
          </div>
          <div
            className={
              "flex-1 flex flex-col justify-center items-end py-4 pl-7 cursor-pointer "
            }
          >
            <div>
              <div className="flex items-start gap-2 mb-4">
                {/* <FaFunnelDollar className="text-[38px] mt-2.5" /> */}
                <h2 className="text-[38px] font-semibold leading-tight max-w-[450px]">
                  Marketing Funnel Optimization
                </h2>
              </div>
              <p className="text-[17px] text-gray-400 tracking-wide leading-normal max-w-[400px]">
                Streamline your customer journey with a well-defined and
                optimized marketing funnel, from awareness to conversion.
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between gap-8">
          <div
            className={
              "flex-1 flex flex-col justify-center items-start py-4 pl-7 cursor-pointer "
            }
          >
            <div>
              <div className="flex items-start gap-2 mb-4">
                {/* <FaFunnelDollar className="text-[38px] mt-2.5" /> */}
                <h2 className="text-[38px] font-semibold leading-tight max-w-[450px]">
                  Brand Voice Development
                </h2>
              </div>
              <p className="text-[17px] text-gray-400 tracking-wide leading-normal max-w-[400px]">
                Define and refine your brand voice to create a consistent and
                authentic brand experience that resonates with your audience.
              </p>
            </div>
          </div>
          <div>
            <Lottie
              className={"w-[380px] h-[380px]"}
              animationData={adDeploymentAnim}
              loop={true}
            />
          </div>
        </div>
        <div className="flex w-full justify-between gap-8">
          <div>
            <Lottie
              className={"w-[380px] h-[380px]"}
              animationData={socialPlatformsAnim}
              loop={true}
            />
          </div>
          <div
            className={
              "flex-1 flex flex-col justify-center items-end py-4 pl-7 cursor-pointer "
            }
          >
            <div>
              <div className="flex items-start gap-2 mb-4">
                {/* <FaFunnelDollar className="text-[38px] mt-2.5" /> */}
                <h2 className="text-[38px] font-semibold leading-tight max-w-[450px]">
                  Omni-Platform Connectivity
                </h2>
              </div>
              <p className="text-[17px] text-gray-400 tracking-wide leading-normal max-w-[400px]">
                Seamlessly connect with all major platforms, including Meta,
                TikTok, and email marketing, to maximize your reach and impact.
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between gap-8">
          <div
            className={
              "flex-1 flex flex-col justify-center items-start py-4 pl-7 cursor-pointer "
            }
          >
            <div>
              <div className="flex items-start gap-2 mb-4">
                {/* <FaFunnelDollar className="text-[38px] mt-2.5" /> */}
                <h2 className="text-[38px] font-semibold leading-tight max-w-[450px]">
                  Chat with AI
                </h2>
              </div>
              <p className="text-[17px] text-gray-400 tracking-wide leading-normal max-w-[400px]">
                Elevate your business with Arti, your AI-driven powerhouse for
                enhancing social media presence and innovative marketing.
              </p>
            </div>
          </div>
          <div>
            <Lottie
              className={"w-[380px] h-[380px]"}
              animationData={startChatAnim}
              loop={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
