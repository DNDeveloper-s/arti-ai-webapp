import StrategicProductImage from "@/assets/images/image1.webp";
import DynamicAdImage from "@/assets/images/image13.webp";
import MultiMediaImage from "@/assets/images/image10.webp";
import RetainImage from "@/assets/images/image4.webp";
import { divide } from "lodash";
import { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

function ServiceTitleRenderer({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 500px)" });
  return (
    <div>
      <h1 className="text-[30px] lg:text-[45px] 2xl:text-[65px] text-white lg:leading-[50px] 2xl:leading-[65px] font-gilroyBold tracking-[-1px]">
        {title}
      </h1>
      {!isSmallScreen && (
        <h4 className="mt-2 mb-4 lg:text-[25px] 2xl:text-[30px] text-white lg:leading-[30px] 2xl:leading-[35px] font-gilroyRegular">
          {subTitle}
        </h4>
      )}
    </div>
  );
}

/**
 * @description {This services is for the product landing page which is more technical}
 */
export const servicesData = {
  cards: [
    {
      id: 1,
      title: (
        <ServiceTitleRenderer
          title="Discover Arti Chat"
          subTitle="Revolutionize Your Social Media Presence and Marketing"
        />
      ),
      description:
        "Elevate your business with Arti, your AI-driven powerhouse for enhancing social media presence and innovative marketing. Our assistant not only understands your business goals but also brings them to life by generating eye-catching advertisement creatives. With Arti, scheduling posts, managing content, and running ads becomes not just easy, but exciting. Ready to transform your business approach and unlock unprecedented growth? Dive into the world of Arti, where the future of marketing awaits.",
      more: {
        heading: "Why Choose Arti Chat?",
        list: [
          `**Engage and Convert**: With Arti's **"creative content generation"** and **"dynamic advertising solutions"**, elevate your brand's message, captivate your audience, and drive conversions like never before.`,
          `**Tailored to Your Needs**: Arti isn't just any assistant; it's your **"personal AI marketing assistant"**, designed to understand and respond to your unique business challenges with custom solutions.`,
          `**Scheduling Made Simple**: Effortlessly plan and adjust your marketing campaigns with Arti, your go-to for **"AI-powered scheduling"**. Streamline your content strategy and ensure consistent engagement without the hassle.`,
        ],
      },
    },
    {
      id: 2,
      title: (
        <ServiceTitleRenderer
          title="Dynamic Content and Ad Crafting"
          subTitle="Revolutionize your connection with your Audience"
        />
      ),
      description:
        "Unlock the power of AI with Dynamic Content and Ad Crafting, your ultimate solution for creating engaging social media content and ads. Imagine captivating your audience with content that not only looks great but resonates on a deeper level, fostering memorable interactions. Dive into a world where each piece of content and advertisement is crafted to perfection, ensuring maximum impact on your business. Ready to revolutionize your marketing strategy? Discover how our AI-driven approach can elevate your brand.",
      more: {
        heading: "Elevate Your Marketing with Precision and Creativity",
        list: [
          `**AI-Powered Precision**: Utilize our **"AI-powered search"** to identify your ideal target audience, ensuring your content and ads reach those most likely to engage and convert. Optimize your marketing efforts with data-driven insights for unparalleled accuracy.`,
          `**Engagement Through Creativity**: With a focus on **"engaging social media content"** and **"dynamic ad crafting,"** our technology creates visually stunning and emotionally resonant materials. Stand out in the digital landscape by connecting with your audience on a more meaningful level.`,
          `**Maximized Impact**: Leverage our expertise in **"influencer marketing"** and **"content creatives"** to amplify your message. Our tailored approach guarantees memorable content and engagement, driving visibility and enhancing your brand's influence.`,
        ],
      },
    },
    {
      id: 3,
      title: (
        <ServiceTitleRenderer
          title="Deploy Your Content and Ads"
          subTitle="Maximize Reach and Insight"
        />
      ),
      description:
        "Unlock the full potential of your digital marketing with a single solution that not only spreads your message across the most influential platforms but also gives you the insight to refine and perfect your strategy.",
      more: {
        heading: "Enhance Your Marketing Efficiency",
        list: [
          `**Broad Platform Support**: Seamlessly publish your content and ads on key channels such as **Facebook**, **Instagram**, **Email Marketing**, and **TikTok**. Our tool simplifies the process, allowing you to reach your audience where they are most active.`,
          `**Advanced Analytics**: Dive deep into how your content is performing with our sophisticated analytics. Understand your audience's behavior, measure engagement, and use these insights to make informed adjustments, ensuring your campaigns always hit their mark.`,
          `**Agile Adaptation**: With real-time performance data at your fingertips, adapt and optimize your advertising on the fly. Our platform empowers you to make immediate adjustments based on comprehensive analytics, maximizing your campaign's impact.`,
        ],
      },
    },
  ],
};

export const mobileServicesData = {
  cards: [
    {
      id: "1",
      title: "​​Arti Chat: Supercharge Your Marketing",
      description:
        "Unlock the power of AI for your social media marketing. With Arti, elevate your marketing through dynamic content creation, strategic ad placements, automatic delivery and performance insights. Ready for growth? Arti awaits..",
      list: [
        `**Engage and Convert**: With Arti's **"creative content generation"** and **"dynamic advertising solutions"**, elevate your brand's message, captivate your audience, and drive conversions like never before.`,
        `**Tailored to Your Needs**: Arti isn't just any assistant; it's your **"personal AI marketing assistant"**, designed to understand and respond to your unique business challenges with custom solutions.`,
        `**Scheduling Made Simple**: Effortlessly plan and adjust your marketing campaigns with Arti, your go-to for **"AI-powered scheduling"**. Streamline your content strategy and ensure consistent engagement without the hassle.`,
      ],
    },
    {
      id: "2",
      title: "Dynamic Content & Ad Crafting",
      description:
        "Revolutionize your brand presence with AI. Based on the conversation, our assistant will craft content and ads that resonate, driving engagement and conversions. Elevate your connection to your audience, with Arti.",
      list: [
        "Target with AI: Find your audience for highest reach and conversion",
        "Creative Engagement: Stand out with visually stunning content compared to your competition",
        "Amplify Impact: Boost visibility and brand influence with tailored ads and content.",
      ],
    },
    {
      id: "3",
      title: "Dynamic Content & Ad Crafting",
      description:
        "Revolutionize your brand presence with AI. Based on the conversation, our assistant will craft content and ads that resonate, driving engagement and conversions. Elevate your connection to your audience, with Arti.",
      list: [
        "Broad Platform Support: Reach your audience, no matter which platform they use",
        "Insightful Analytics: Understand and adapt to campaign performance, and compare them across platform",
        '**Scheduling Made Simple**: Effortlessly plan and adjust your marketing campaigns with Arti, your go-to for **"AI-powered scheduling”**',
      ],
    },
  ],
};
