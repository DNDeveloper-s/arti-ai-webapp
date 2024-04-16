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
}
export default function InsightCard({ campaign }: InsightCardProps) {
  const insights = campaign.insights?.data || [];
  const latestInsight = insights[0] ?? {};
  const extractedInsight = extractFromInsights(latestInsight);
  const noInsights = !extractedInsight;
  const hasInsights = !!extractedInsight;

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
        "w-[25rem] flex-shrink-0 h-[13rem] relative border-2 border-secondaryBackground transition-all cursor-pointer hover:border-primary rounded-xl overflow-hidden text-[9px] bg-secondaryBackground"
      }
      prefetch={true}
    >
      <div className="pointer-events-none w-full h-full absolute top-0 z-10 left-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.00)_55.23%,_rgba(0,0,0,0.61)_77%,_rgba(0,0,0,0.82)_100%)]" />
      <div className="py-3 px-3 flex items-center justify-between">
        <h2 className="whitespace-nowrap w-full overflow-hidden overflow-ellipsis mr-5 text-base font-medium text-primary">
          {campaign.name}
        </h2>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-evenly">
          <div className="flex flex-col items-end">
            <div className="flex gap-1 items-center">
              <TbBulbFilled className="text-primary text-3xl" />
              <p className="text-xl mt-1">
                {extractedInsight?.impressions ?? 0}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Impressions</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex gap-2 items-center">
              <FaHandshakeSimple className="text-primary text-3xl" />
              <p className="text-xl mt-1">{extractedInsight?.leads ?? 0}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Leads</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex gap-2 items-center">
              <IoWallet className="text-primary text-2xl" />
              <p className="text-xl mt-1">${extractedInsight?.spent ?? 0}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Spent</span>
            </div>
          </div>
        </div>
        <div className="px-5 grid grid-cols-4 gap-3 mt-3">
          {Object.keys(globalKeyObject).map((key, index) => (
            <div key={key} className="flex justify-end">
              <div className="flex flex-col items-end gap-1 py-1 px-2 bg-gray-800 rounded">
                <p className="text-sm text-gray-200">
                  {formatInsightValue(
                    globalKeyObject[key as keyof typeof globalKeyObject]
                  )}
                </p>
                <p className="text-[10px] text-gray-500">
                  {formatInsightName(key)}
                </p>
              </div>
            </div>
          ))}
          {latestInsight?.actions?.map((action, index) => (
            <div key={action.action_type} className="flex justify-end">
              <div className="flex flex-col items-end gap-1 py-1 px-2 bg-gray-800 rounded">
                <p className="text-sm text-gray-200">
                  {formatInsightValue(action.value)}
                </p>
                <p className="text-[10px] text-gray-500">
                  {formatInsightName(action.action_type)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
