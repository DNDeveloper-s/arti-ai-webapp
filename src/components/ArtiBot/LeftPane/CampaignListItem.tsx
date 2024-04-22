import { IAdCreative } from "@/interfaces/IAdCreative";
import React, { FC, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CardStackImages,
  ImageType,
} from "@/components/ArtiBot/LeftPane/ConversationListItem";
import {
  TimeRange,
  UserCampaign,
  useGetCampaignInsights,
} from "@/api/conversation";
import useInView from "@/hooks/useInView";
import { IFacebookAdInsight } from "@/interfaces/ISocial";
import { getCampaignPageUrl, getConversationURL } from "@/helpers";
import { useCurrentConversation } from "@/context/CurrentConversationContext";
import { ConversationType } from "@/interfaces/IConversation";
import { useRouter } from "next/navigation";
import { Route53RecoveryCluster } from "aws-sdk";
import { ICampaignInfinite } from "@/api/admanager";
import dayjs from "dayjs";

export const CampaignInsightShimmer = () => {
  return (
    <div className="grid grid-cols-[2fr_3fr_3fr] gap-3">
      <div className="flex gap-1 flex-shrink-0 flex-col">
        <span className="font-bold app-shimmer rounded text-base">64</span>
        <p className="text-[10px] app-shimmer rounded leading-[15px] max-w-[60px] text-gray-400 whitespace-pre-wrap">
          Leads
        </p>
      </div>
      <div className="flex gap-1 flex-shrink-0 flex-col">
        <span className="font-bold app-shimmer rounded text-base">$10.83</span>
        <p className="text-[10px] app-shimmer rounded leading-[15px] max-w-[60px] text-gray-400 whitespace-pre-wrap">
          Lead Cost
        </p>
      </div>
      <div className="flex gap-1 flex-shrink-0 flex-col">
        <span className="font-bold app-shimmer rounded text-base">$693.06</span>
        <p className="text-[10px] app-shimmer rounded leading-[15px] max-w-[60px] text-gray-400 whitespace-pre-wrap">
          Spent
        </p>
      </div>
    </div>
  );
};

export const CampaignListItemShimmer = () => {
  return (
    <div
      className={
        "animate-pulse flex flex-shrink-0 flex-col gap-4 px-4 mx-2 py-3 hover:bg-gray-900 bg-gray-950 rounded text-gray-300 cursor-pointer overflow-hidden transition-all text-sm leading-6"
      }
    >
      <div className="flex gap-4 items-start ">
        {/* <CardStackImages images={[]} /> */}
        <span className={"app-shimmer rounded truncate"}>My one Campaign</span>
      </div>
      <CampaignInsightShimmer />
    </div>
  );
};

export function extractFromInsights(insight?: IFacebookAdInsight) {
  if (!insight) return null;
  return {
    impressions: insight.impressions,
    leads: insight.actions?.find((a) => a.action_type === "lead")?.value || 0,
    reach: insight.reach,
    spent: insight.spend,
  };
}

interface CampaignListItemProps {
  campaign: ICampaignInfinite;
  containerClassName?: string;
}

export const defaultTimeRange: TimeRange = [
  dayjs().subtract(7, "days"),
  dayjs(),
];

const CampaignListItem: FC<CampaignListItemProps> = ({
  campaign,
  containerClassName,
}) => {
  const router = useRouter();
  const { ref, isInView } = useInView();
  // const { data: campaignWithInsights, isLoading } = useGetCampaignInsights({
  //   campaignId: campaign.id,
  //   enabled: isInView,
  // });
  // const { conversation } = useCurrentConversation();
  useGetCampaignInsights({
    campaignId: campaign.id,
    timeRange: defaultTimeRange,
    enabled: isInView,
  });

  const insights = campaign?.insights?.data || [];
  const latestInsight = insights[0];
  const extractedInsight = extractFromInsights(latestInsight);

  // const waitingForInsights = isLoading;
  const noInsights = !extractedInsight;
  const hasInsights = !!extractedInsight;

  const url = useMemo(() => getCampaignPageUrl(campaign.id), [campaign.id]);

  const goTo = () => {
    router.push(url);
  };

  useEffect(() => {
    url && router.prefetch(url);
  }, [router, url]);

  useEffect(() => {}, [router]);

  return (
    <div
      onClick={goTo}
      ref={ref}
      key={campaign.id}
      className={
        "flex flex-col gap-4 px-4 mx-2 py-3 hover:bg-gray-900 bg-gray-950 rounded text-gray-300 cursor-pointer overflow-hidden transition-all text-sm leading-6 " +
        (containerClassName ?? "")
      }
    >
      <div className="flex gap-4 items-start ">
        {/* <CardStackImages images={images} /> */}
        <div>
          <span className={"truncate"}>{campaign.name}</span>
          {noInsights && (
            <div className="flex gap-1 flex-shrink-0 flex-col">
              <span className="text-xs opacity-40">No Insights</span>
            </div>
          )}
        </div>
      </div>
      {/* {waitingForInsights && <CampaignInsightShimmer />} */}
      {hasInsights && (
        <div className="grid grid-cols-[2fr_3fr_3fr] gap-3">
          <div className="flex gap-1 flex-shrink-0 flex-col">
            <span className="font-bold text-base">
              {extractedInsight.impressions}
            </span>
            <p className="text-[10px] leading-[15px] max-w-[60px] text-gray-400 whitespace-pre-wrap">
              Impressions
            </p>
          </div>
          <div className="flex gap-1 flex-shrink-0 flex-col">
            <span className="font-bold text-base">
              {extractedInsight.leads}
            </span>
            <p className="text-[10px] leading-[15px] max-w-[60px] text-gray-400 whitespace-pre-wrap">
              Leads
            </p>
          </div>
          <div className="flex gap-1 flex-shrink-0 flex-col">
            <span className="font-bold text-base">
              ${extractedInsight.spent}
            </span>
            <p className="text-[10px] leading-[15px] max-w-[60px] text-gray-400 whitespace-pre-wrap">
              Spent
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignListItem;
