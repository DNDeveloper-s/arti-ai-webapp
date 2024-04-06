import { useGetUserCampaigns } from "@/api/conversation";
import CampaignListItem, { CampaignListItemShimmer } from "./CampaignListItem";
import { PaginatedList } from "./LeftPane";

export default function CampaignSection() {
  const {
    data,
    isLoading,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    ...props
  } = useGetUserCampaigns();
  const campaigns = data?.pages.map((page) => page).flat() || [];

  return (
    <div className="w-full my-4">
      <div className="px-4 text-sm font-bold text-gray-400">
        <h3>Campaigns</h3>
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <PaginatedList doInfiniteScroll={true}>
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
