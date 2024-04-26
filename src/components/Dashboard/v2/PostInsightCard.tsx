import { ICampaignInfinite } from "@/api/admanager";
import { useGetVariant } from "@/api/conversation";
import { FacebookPost } from "@/api/social";
import { extractFromInsights } from "@/components/ArtiBot/LeftPane/CampaignListItem";
import {
  formatInsightName,
  formatInsightValue,
} from "@/components/ArtiBot/MessageItems/Insights/DeployAdInsightsCard";
import { Divider } from "antd";
import { omit } from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { FaHandshakeSimple } from "react-icons/fa6";
import { IoWallet } from "react-icons/io5";
import { TbBulbFilled } from "react-icons/tb";

function extractPostInsights(insight: FacebookPost) {
  return {
    likes: insight.likes?.data.length ?? 0,
    comments: insight.comments?.data.length ?? 0,
    shares: insight.shares?.count ?? 0,
  };
}

interface PostInsightCardProps {
  post: FacebookPost;
  last7Day: FacebookPost | undefined;
}
export default function PostInsightCard({
  post,
  last7Day,
}: PostInsightCardProps) {
  const router = useRouter();
  const { data: variant } = useGetVariant({ post_id: post.id });
  const insights = post.insights || [];
  const latestInsight = insights[0] ?? {};
  const extractedInsight = extractPostInsights(post);

  const last7Insights = last7Day?.insights || [];
  const last7DayInsight = last7Insights[0] ?? {};
  const extractedLast7Insight = extractPostInsights(post);

  const globalKeyObject = omit(latestInsight, [
    "date_start",
    "date_stop",
    "actions",
    "conversions",
  ]);
  const url = useMemo(() => {
    return `/artibot?conversation_id=${variant?.AdCreative.conversationId}&message_id=${variant?.AdCreative.messageId}`;
  }, [variant]);

  useEffect(() => {
    try {
      url && router.prefetch(url);
    } catch (e) {
      console.log("Error prefetching url", e, url);
    }
  }, [url, router]);

  return (
    <Link
      href={url}
      className={
        "w-[25rem] flex flex-col flex-shrink-0 h-[13rem] relative border-2 border-secondaryBackground transition-all cursor-pointer hover:border-primary rounded-xl overflow-hidden text-[9px] bg-secondaryBackground"
      }
      prefetch={true}
    >
      {/* <div className="pointer-events-none w-full h-full absolute top-0 z-10 left-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.00)_55.23%,_rgba(0,0,0,0.61)_77%,_rgba(0,0,0,0.82)_100%)]" /> */}
      <div className="py-3 px-3 flex items-center justify-between">
        <h2 className=" w-full overflow-hidden  mr-5 text-base font-medium text-primary line-clamp-1">
          {post.message}
        </h2>
      </div>
      <div className="flex-1 flex flex-col pb-2">
        <div className="flex-1 grid grid-cols-3 w-full">
          <div className="flex items-center gap-1 justify-center">
            <TbBulbFilled className="text-primary text-3xl" />
            <span className="text-gray-400 text-xs mt-1">Likes</span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <FaHandshakeSimple className="text-primary text-3xl" />
            <span className="text-gray-400 text-xs">Comments</span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <IoWallet className="text-primary text-2xl" />
            <span className="text-gray-400 text-xs">Shares</span>
          </div>
        </div>
        <Divider className="my-1 w-[90%] mx-auto opacity-40" />
        <div className="flex-1 grid grid-cols-3 w-full">
          <div className="flex items-center justify-center">
            <span className="text-xl">{extractedLast7Insight?.likes ?? 0}</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-xl">
              {extractedLast7Insight?.comments ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-xl">
              {extractedLast7Insight?.shares ?? 0}
            </span>
          </div>
        </div>
        <div className="w-full flex justify-end pr-6">
          <p className="text-gray-500 text-[10px]">Last 7 days</p>
        </div>
        <Divider className="my-1 w-[90%] mx-auto opacity-40" />
        <div className="flex-1 grid grid-cols-3 w-full">
          <div className="flex items-center justify-center">
            <span className="text-xl">{extractedInsight?.likes ?? 0}</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-xl">{extractedInsight?.comments ?? 0}</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-xl">{extractedInsight?.shares ?? 0}</span>
          </div>
        </div>
        <div className="w-full flex justify-end pr-6">
          <p className="text-gray-500 text-[10px]">Lifetime</p>
        </div>
      </div>
    </Link>
  );
}
