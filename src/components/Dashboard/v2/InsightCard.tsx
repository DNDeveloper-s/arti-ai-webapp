import { ICampaignInfinite } from "@/api/admanager";
import { extractFromInsights } from "@/components/ArtiBot/LeftPane/CampaignListItem";
import {
  formatInsightName,
  formatInsightValue,
} from "@/components/ArtiBot/MessageItems/DeployAdInsightsCard";
import { Divider } from "antd";
import { omit } from "lodash";
import Link from "next/link";
import { FaHandshakeSimple } from "react-icons/fa6";
import { IoWallet } from "react-icons/io5";
import { TbBulbFilled } from "react-icons/tb";

interface InsightCardProps {
  campaign: ICampaignInfinite;
  last7Day: ICampaignInfinite | undefined;
}
export default function InsightCard({ campaign, last7Day }: InsightCardProps) {
  const insights = campaign.insights?.data || [];
  const latestInsight = insights[0] ?? {};
  const extractedInsight = extractFromInsights(latestInsight);

  const last7Insights = last7Day?.insights?.data || [];
  const last7DayInsight = last7Insights[0] ?? {};
  const extractedLast7Insight = extractFromInsights(last7DayInsight);

  const globalKeyObject = omit(latestInsight, [
    "date_start",
    "date_stop",
    "actions",
    "conversions",
  ]);

  return (
    <Link
      href={`/artibot/ad_creative?campaign_id=${campaign.id}`}
      className={
        "w-[25rem] flex flex-col flex-shrink-0 h-[13rem] relative border-2 border-secondaryBackground transition-all cursor-pointer hover:border-primary rounded-xl overflow-hidden text-[9px] bg-secondaryBackground"
      }
      prefetch={true}
    >
      {/* <div className="pointer-events-none w-full h-full absolute top-0 z-10 left-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.00)_55.23%,_rgba(0,0,0,0.61)_77%,_rgba(0,0,0,0.82)_100%)]" /> */}
      <div className="py-3 px-3 flex items-center justify-between">
        <h2 className="whitespace-nowrap w-full overflow-hidden overflow-ellipsis mr-5 text-base font-medium text-primary">
          {campaign.name}
        </h2>
      </div>
      <div className="flex-1 flex flex-col pb-2">
        <div className="flex-1 grid grid-cols-3 w-full">
          <div className="flex items-center gap-1 justify-center">
            <TbBulbFilled className="text-primary text-3xl" />
            <span className="text-gray-400 text-xs mt-1">Impressions</span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <FaHandshakeSimple className="text-primary text-3xl" />
            <span className="text-gray-400 text-xs">Leads</span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <IoWallet className="text-primary text-2xl" />
            <span className="text-gray-400 text-xs">Spent</span>
          </div>
        </div>
        <Divider className="my-1 w-[90%] mx-auto opacity-40" />
        <div className="flex-1 grid grid-cols-3 w-full">
          <div className="flex items-center justify-center">
            <span className="text-xl">
              {extractedLast7Insight?.impressions ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-xl">{extractedLast7Insight?.leads ?? 0}</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-xl">
              ${extractedLast7Insight?.spent ?? 0}
            </span>
          </div>
        </div>
        <div className="w-full flex justify-end pr-6">
          <p className="text-gray-500 text-[10px]">Last 7 days</p>
        </div>
        <Divider className="my-1 w-[90%] mx-auto opacity-40" />
        <div className="flex-1 grid grid-cols-3 w-full">
          <div className="flex items-center justify-center">
            <span className="text-xl">
              {extractedInsight?.impressions ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-xl">{extractedInsight?.leads ?? 0}</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-xl">${extractedInsight?.spent ?? 0}</span>
          </div>
        </div>
        <div className="w-full flex justify-end pr-6">
          <p className="text-gray-500 text-[10px]">Lifetime</p>
        </div>
      </div>
    </Link>
  );
}
