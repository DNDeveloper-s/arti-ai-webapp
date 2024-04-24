import { useMemo } from "react";
import AdCreativeListItem, {
  AdCreativeListItemShimmer,
} from "./AdCreativeListItem";
import { LeftPaneSectionBaseProps, PaginatedList } from "./LeftPane";
import { useGetVariantsByConversation } from "@/api/conversation";
import { RiExpandUpDownLine } from "react-icons/ri";

interface AdCreativeSectionProps extends LeftPaneSectionBaseProps {}
export default function AdCreativeSection(props: AdCreativeSectionProps) {
  const {
    data,
    isLoading,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    ...queryProps
  } = useGetVariantsByConversation();
  const adCreatives = useMemo(
    () => data?.pages.map((page) => page).flat() || [],
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
        <h3>Ad Creatives</h3>
        {!props.isActive && (
          <div
            className="cursor-pointer"
            onClick={() => {
              props.onSectionActive && props.onSectionActive("ad_creative");
            }}
          >
            <RiExpandUpDownLine />
          </div>
        )}
      </div>
      <div
        className="mt-2 flex flex-col gap-2 overflow-auto"
        onScroll={() => {
          props.onSectionActive && props.onSectionActive("ad_creative");
        }}
      >
        <PaginatedList
          noMore={!hasNextPage}
          handleLoadMore={queryProps.fetchNextPage}
          loading={isLoading || isFetching || isFetchingNextPage}
          doInfiniteScroll
          noPrevMore={true}
        >
          {isPending &&
            [1, 2, 3, 4].map((ind) => <AdCreativeListItemShimmer key={ind} />)}
          {adCreatives.map((variantByConversation) => (
            <AdCreativeListItem
              key={variantByConversation.id}
              adCreative={variantByConversation.ad_creative}
              conversationId={variantByConversation.id}
              variants={variantByConversation.variants}
              containerClassName="flex-shrink-0"
            />
          ))}
        </PaginatedList>
      </div>
    </div>
  );
}
