import {
  FutureIcon,
  InnovationIcon,
  RevolutionIcon,
  UserCentricIcon,
} from "@/constants/productPageData/whyUs/icons";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import React, { ReactElement, ReactNode } from "react";

interface WhyUsData {
  title: string;
  subTitle?: string;
  description: string;
  cta?: string;
  bottomLine?: string;
  bottomLine2?: string;
  items: WhyUsItem[];
}

export interface WhyUsItem {
  id: number;
  title: string;
  overview: string;
  readMore?: string[];
  icon?: (props: any) => JSX.Element;
  groupId?: number;
}

export const whyUsData: WhyUsData = {
  title: "Why Us",
  subTitle: "​​Transform Your Marketing with Precision and Impact",
  description:
    "Step into a world where your marketing efforts are not just seen but felt. Our platform provides the ultimate toolkit for crafting, deploying, and optimizing your digital marketing campaigns, ensuring every dollar you spend works harder for you. Discover why partnering with us means elevating your marketing strategy to its peak potential.",
  // cta: 'Generate Ad Creatives',
  // bottomLine: 'Try 100% free for 7 days. Cancel Anytime',
  // bottomLine2: 'Look at our few generated ad creatives',
  items: [
    {
      id: 1,
      title: "Comprehensive Platform Integration: Expand Your Digital Horizon",
      overview:
        "Unleash the power of seamless integration across the biggest digital platforms. Our solution is your gateway to boundless marketing opportunities.",
      readMore: [
        "Seamlessly manage campaigns across Facebook, Instagram, Email Marketing, and TikTok.",
        "Enjoy simplified campaign creation that lets you focus on creativity and strategy.",
        "Reach broader audiences with targeted content that speaks directly to their interests.",
      ],
      icon: RevolutionIcon,
      groupId: 1,
    },
    {
      id: 2,
      title: "Data-Driven Insights: The Key to Unlocked Potential",
      overview:
        "Delve into the heart of your marketing campaigns with analytics that illuminate the path to success. Our insights transform data into strategic power.",
      readMore: [
        "Gain actionable insights with our advanced analytics, understanding your audience like never before.",
        "Make informed decisions that significantly boost campaign performance and ROI.",
        "Leverage detailed reports to refine and perfect your marketing messages for peak engagement.",
      ],
      icon: InnovationIcon,
      groupId: 1,
    },
    {
      id: 3,
      title: "Real-Time Campaign Optimization: Agile Marketing Mastery",
      overview:
        "Stay ahead in the fast-paced digital world. Our platform offers the agility to adapt and thrive, keeping your campaigns at the forefront of innovation.",
      readMore: [
        "Instantly tweak and tune your campaigns based on real-time data and feedback.",
        "Optimize ad spend across channels for maximum impact and efficiency.",
        "Harness the flexibility to pivot strategies swiftly, ensuring your brand remains relevant and engaging.",
      ],
      icon: UserCentricIcon,
      groupId: 2,
    },
    {
      id: 4,
      title: "Dedicated Support and Innovation: A Customer-Centric Approach",
      overview:
        "Experience the difference of a partnership that puts you first. Our dedication to support and innovation is the bedrock of your marketing success.",
      readMore: [
        "Benefit from a team that's always on your side, ready to offer expert advice and support.",
        "Enjoy continuous updates and new features designed with your feedback and needs in mind.",
        "Rely on a platform that evolves with the market, ensuring you're always equipped with cutting-edge tools.",
      ],
      icon: FutureIcon,
      groupId: 2,
    },
  ],
};
