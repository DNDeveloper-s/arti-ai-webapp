import { useGetUserCampaigns } from "@/api/conversation";
import CampaignListItem, { CampaignListItemShimmer } from "./CampaignListItem";
import { LeftPaneSectionBaseProps, PaginatedList } from "./LeftPane";
import Link from "next/link";
import { getConversationURL } from "@/helpers";
import { useSearchParams } from "next/navigation";
import { ConversationType } from "@/interfaces/IConversation";
import { useMemo, useState } from "react";
import { useGetInifiniteCampaigns } from "@/api/admanager";
import { RiExpandUpDownLine } from "react-icons/ri";

interface CampaignSectionProps extends LeftPaneSectionBaseProps {}

export default function CampaignSection(props: CampaignSectionProps) {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaign_id");
  const {
    data,
    isLoading,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    ...queryProps
  } = useGetInifiniteCampaigns({
    campaign_id: campaignId,
  });
  const campaigns = useMemo(
    () => data?.pages.map((page) => page.data).flat() || [],
    [data]
  );

  return (
    <div
      className={
        "w-full my-4 flex-1 overflow-hidden flex flex-col transition-all " +
        (props.isActive ? " basis-6/12" : "")
      }
    >
      <div className="px-4 text-sm font-bold text-gray-400 flex items-center justify-between">
        <h3>Campaigns</h3>
        {!props.isActive && (
          <div
            className="cursor-pointer"
            onClick={() => {
              props.onSectionActive && props.onSectionActive("campaign");
            }}
          >
            <RiExpandUpDownLine />
          </div>
        )}
      </div>
      <div
        className="mt-2 flex flex-col gap-2 overflow-auto"
        onScroll={() => {
          props.onSectionActive && props.onSectionActive("campaign");
        }}
      >
        <PaginatedList
          noMore={!hasNextPage}
          handleLoadMore={queryProps.fetchNextPage}
          loading={isLoading || isFetching || isFetchingNextPage}
          handlePrevMore={queryProps.fetchPreviousPage}
          noPrevMore={!queryProps.hasPreviousPage}
          doInfiniteScroll
        >
          {isLoading &&
            [1, 2, 3, 4].map((ind) => <CampaignListItemShimmer key={ind} />)}
          {!isLoading &&
            campaigns.map((campaign) => (
              <CampaignListItem
                key={campaign.id}
                containerClassName="flex-shrink-0"
                campaign={campaign}
              />
            ))}
        </PaginatedList>
      </div>
    </div>
  );
}
