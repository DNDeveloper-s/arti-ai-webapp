import { useGetUserCampaigns } from "@/api/conversation";
import CampaignListItem, { CampaignListItemShimmer } from "./CampaignListItem";
import { PaginatedList } from "./LeftPane";
import Link from "next/link";
import { getConversationURL } from "@/helpers";
import { useSearchParams } from "next/navigation";
import { ConversationType } from "@/interfaces/IConversation";
import { useMemo } from "react";
import { useGetInifiniteCampaigns } from "@/api/admanager";

export default function CampaignSection() {
  const {
    data,
    isLoading,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    ...props
  } = useGetInifiniteCampaigns();
  const campaigns = useMemo(
    () => data?.pages.map((page) => page.data).flat() || [],
    [data]
  );

  const searchParams = useSearchParams();

  return (
    <div className="w-full my-4">
      <div className="px-4 text-sm font-bold text-gray-400">
        <h3>Campaigns</h3>
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <PaginatedList
          noMore={!hasNextPage}
          handleLoadMore={props.fetchNextPage}
          loading={isLoading || isFetching || isFetchingNextPage}
        >
          {isLoading &&
            [1, 2, 3, 4].map((ind) => <CampaignListItemShimmer key={ind} />)}
          {!isLoading &&
            campaigns.map((campaign) => (
              <CampaignListItem key={campaign.id} campaign={campaign} />
            ))}
        </PaginatedList>
      </div>
    </div>
  );
}
