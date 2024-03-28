import StrategicProductImage from "@/assets/images/image1.webp";
import DynamicAdImage from "@/assets/images/image13.webp";
import MultiMediaImage from "@/assets/images/image10.webp";
import RetainImage from "@/assets/images/image4.webp";
import { divide } from "lodash";
import { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

/**@deprecated */
export const legacy_servicesData = {
  cards: [
    {
      id: 1,
      span: 2,
      image: DynamicAdImage,
      title: "Dynamic Ad Crafting",
      overview:
        "Elevate your brand's narrative with our Dynamic Ad Crafting. Powered by AI, we design ad content that is not only visually compelling but also deeply resonant with your target audience, creating memorable engagements.",
      learnMore:
        "Step into an innovative space where technology fuses with creativity. Our state-of-the-art algorithms intricately weave your brand's ethos into every ad design, ensuring unique and impactful results. With Dynamic Ad Crafting, you'll move beyond traditional advertising towards bespoke, influential campaigns.",
    },
    {
      id: 2,
      image: StrategicProductImage,
      title: "Strategic Product Blueprint",
      overview:
        "Reimagine your product's journey with our Strategic Product Blueprint. Delving into market insights and leveraging AI-driven analytics, we formulate product strategies that navigate the competitive landscape with prowess.",
      learnMore:
        "In today's rapidly evolving market, navigating product strategy can be a maze. Our service deciphers the intricacies, offering a clear path designed with a blend of data analytics and intuitive foresight. Experience the edge of AI-informed decision-making with the Strategic Product Blueprint.",
    },
    {
      id: 3,
      image: MultiMediaImage,
      title: "Multi-Media Ad Creatives",
      overview:
        "Transform your online presence with Digital Content Alchemy. Drawing from AI and design expertise, we conjure up captivating text and imagery tailored for optimal engagement on your social channels and banners.",
      learnMore:
        "Digital content isn't just about visuals; it's about crafting stories that resonate. With Digital Content Alchemy, experience the synthesis of art and technology as we curate content that's not only visually stunning but also strategically aligned with your brand ethos and audience preferences. Illuminate your digital platforms with unparalleled vibrancy and intent.",
    },
    {
      id: 4,
      image: RetainImage,
      title: "Retain Your Brand Identity",
      overview:
        "Maintain the essence of your brand while scaling new heights. Utilizing AI, we ensure that your brand's core values and unique selling propositions are consistently represented across all platforms and campaigns.",
      learnMore:
        "Scaling your business doesn't mean losing your brand's soul. Our AI-powered tool analyzes your brand's key elements and integrates them into every strategic plan and creative output. From color schemes to tone of voice, experience seamless brand consistency like never before with Retain Your Brand Identity.",
    },
  ],
};

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

function Dull({ children }: { children: ReactNode }) {
  return <span className="text-white text-opacity-60">{children}</span>;
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
          <span key="1">
            <strong>Engage and Convert:</strong> <Dull>With Arti&apos;s </Dull>
            <strong>&quot;creative content generation&quot;</strong>
            <Dull> and </Dull>
            <strong>&quot;dynamic advertising solutions&quot;,</strong>
            <Dull>
              {" "}
              elevate your brand&apos;s message, captivate your audience, and
              drive conversions like never before.
            </Dull>
          </span>,
          <span key="2">
            <strong>Tailored to Your Needs:</strong>{" "}
            <Dull>Arti isn&apos;t just any assistant; it&apos;s your </Dull>
            <strong>&quot;personal AI marketing assistant&quot;,</strong>
            <Dull>
              {" "}
              designed to understand and respond to your unique business
              challenges with custom solutions.{" "}
            </Dull>
          </span>,
          <span key="3">
            <strong>Scheduling Made Simple:</strong>{" "}
            <Dull>
              Effortlessly plan and adjust your marketing campaigns with Arti,
              your go-to for{" "}
            </Dull>
            <strong>&quot;AI-powered scheduling.&quot;</strong>
            <Dull>
              Streamline your content strategy and ensure consistent engagement
              without the hassle.
            </Dull>
          </span>,
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
          <span key="1">
            <strong>AI-Powered Precision: </strong>
            <Dull>Utilize our </Dull>
            <strong>&quot;AI-powered search&quot;</strong>{" "}
            <Dull>
              to identify your ideal target audience, ensuring your content and
              ads reach those most likely to engage and convert. Optimize your
              marketing efforts with data-driven insights for unparalleled
              accuracy.
            </Dull>
          </span>,
          <span key="2">
            <strong>Engagement Through Creativity: </strong>
            <Dull>With a focus on </Dull>
            <strong>&quot;engaging social media content&quot;</strong>
            <Dull> and </Dull>
            <strong>&quot;dynamic ad crafting,&quot;</strong>{" "}
            <Dull>
              our technology creates visually stunning and emotionally resonant
              materials. Stand out in the digital landscape by connecting with
              your audience on a more meaningful level.
            </Dull>
          </span>,
          <span key="3">
            <strong>Maximized Impact: </strong>
            <Dull>Leverage our expertise in </Dull>
            <strong>&quot;influencer marketing&quot;</strong>
            <Dull> and </Dull>
            <strong>&quot;content creatives&quot;</strong>{" "}
            <Dull>
              to amplify your message. Our tailored approach guarantees
              memorable content and engagement, driving visibility and enhancing
              your brand&apos;s influence.
            </Dull>
          </span>,
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
          <span key="1">
            <strong>Broad Platform Support: </strong>
            <Dull>
              Seamlessly publish your content and ads on key channels such as
              Facebook, Instagram, Email Marketing, and TikTok. Our tool
              simplifies the process, allowing you to reach your audience where
              they are most active.
            </Dull>
          </span>,
          <span key="2">
            <strong>Advanced Analytics: </strong>
            <Dull>
              Dive deep into how your content is performing with our
              sophisticated analytics. Understand your audience&apos;s behavior,
              measure engagement, and use these insights to make informed
              adjustments, ensuring your campaigns always hit their mark.
            </Dull>
          </span>,
          <span key="3">
            <strong>Agile Adaptation: </strong>
            <Dull>
              With real-time performance data at your fingertips, adapt and
              optimize your advertising on the fly. Our platform empowers you to
              make immediate adjustments based on comprehensive analytics,
              maximizing your campaign&apos;s impact.
            </Dull>
          </span>,
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
    },
    {
      id: "2",
      title: "AI Chat that understand your business needs",
      description:
        "Our assistant understands your business goals and brings them to life by generating eye-catching advertisements and content creatives. You don’t need to be an expert in marketing,  just chat with our assistant to be guided through the marketing process seamlessly.",
    },
    {
      id: "3",
      title: "Dynamic Content & Ad Crafting",
      description:
        "Revolutionize your brand presence with AI. Based on the conversation, our assistant will craft content and ads that resonate, driving engagement and conversions. Elevate your connection to your audience, with Arti.",
    },
  ],
};
