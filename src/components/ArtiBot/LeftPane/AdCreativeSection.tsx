import { useMemo } from "react";
import AdCreativeListItem, {
  AdCreativeListItemShimmer,
} from "./AdCreativeListItem";
import { PaginatedList } from "./LeftPane";
import { useGetVariantsByConversation } from "@/api/conversation";

export default function AdCreativeSection() {
  const {
    data,
    isLoading,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    ...props
  } = useGetVariantsByConversation();
  const adCreatives = useMemo(
    () => data?.pages.map((page) => page).flat() || [],
    [data]
  );

  return (
    <div className="w-full my-4">
      <div className="px-4 text-sm font-bold text-gray-400">
        <h3>Ad Creatives</h3>
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <PaginatedList
          noMore={!hasNextPage}
          handleLoadMore={props.fetchNextPage}
          loading={isLoading || isFetching || isFetchingNextPage}
        >
          {isPending &&
            [1, 2, 3, 4].map((ind) => <AdCreativeListItemShimmer key={ind} />)}
          {adCreatives.map((variantByConversation) => (
            <AdCreativeListItem
              key={variantByConversation.id}
              adCreative={variantByConversation.ad_creative}
              conversationId={variantByConversation.id}
              variants={variantByConversation.variants}
            />
          ))}
        </PaginatedList>
      </div>
    </div>
  );
}
