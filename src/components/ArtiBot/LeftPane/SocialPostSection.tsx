import {
  useGetConversationInfinite,
  useGetUserCampaigns,
} from "@/api/conversation";
import CampaignListItem, { CampaignListItemShimmer } from "./CampaignListItem";
import { LeftPaneSectionBaseProps, PaginatedList } from "./LeftPane";
import Link from "next/link";
import { getConversationURL } from "@/helpers";
import { useSearchParams } from "next/navigation";
import { ConversationType } from "@/interfaces/IConversation";
import { useMemo, useState } from "react";
import { useGetInifiniteCampaigns } from "@/api/admanager";
import { RiExpandUpDownLine } from "react-icons/ri";
import { useQueryPostsByPageId } from "@/api/social";
import { useBusiness } from "@/context/BusinessContext";
import SocialPostListItem, {
  SocialPostItemShimmer,
} from "./SocialPostListItem";
import PostInsightModal from "@/components/PostInsightModal";

interface SocialPostSectionProps extends LeftPaneSectionBaseProps {}

export default function SocialPostSection(props: SocialPostSectionProps) {
  //   const searchParams = useSearchParams();
  //   const campaignId = searchParams.get("campaign_id");
  //   const {
  //     data,
  //     isLoading,
  //     hasNextPage,
  //     isFetching,
  //     isFetchingNextPage,
  //     ...queryProps
  //   } = useGetInifiniteCampaigns({
  //     campaign_id: campaignId,
  //   });
  const [openInsightModal, setOpenInsightModal] = useState(false);
  const { businessMap } = useBusiness();
  // const {
  //   posts,
  //   isLoading,
  //   hasNextPage,
  //   isFetching,
  //   isFetchingNextPage,
  //   ...queryProps
  // } = useQueryPostsByPageId(businessMap.getFacebookPage()?.provider_id);
  const {
    data,
    isLoading,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    ...queryProps
  } = useGetConversationInfinite(undefined, false, true, "posts");

  const posts = useMemo(() => {
    return data?.pages.map((page) => page).flat() || [];
  }, [data]);

  const noData = !posts.length && !isLoading;

  return (
    <div
      className={
        "w-full my-4 flex-1 overflow-hidden flex flex-col transition-all " +
        (props.isActive && !noData ? " basis-6/12" : "")
      }
    >
      <div className="px-4 text-sm font-bold text-gray-400 flex items-center justify-between">
        <h3>Social Posts</h3>
        {!props.isActive && !noData && (
          <div
            className="cursor-pointer"
            onClick={() => {
              props.onSectionActive && props.onSectionActive("social_post");
            }}
          >
            <RiExpandUpDownLine />
          </div>
        )}
      </div>
      {noData && (
        <div className="text-xs leading-6 transition-all px-4 py-1 mt-4 text-gray-500  flex justify-center items-center">
          <div className="flex flex-1 items-center justify-center gap-2">
            <span>No Posts</span>
          </div>
        </div>
      )}
      {!noData && (
        <div
          className="mt-2 flex flex-col gap-2 overflow-auto"
          onMouseOver={() => {
            props.onSectionActive && props.onSectionActive("social_post");
          }}
        >
          <PaginatedList
            noMore={!hasNextPage}
            handleLoadMore={queryProps.fetchNextPage}
            loading={isLoading || isFetching || isFetchingNextPage}
            // handlePrevMore={queryProps.fetchPreviousPage}
            // noPrevMore={!queryProps.hasPreviousPage}
            doInfiniteScroll
          >
            {isLoading &&
              [1, 2, 3, 4].map((ind) => <SocialPostItemShimmer key={ind} />)}
            {!isLoading &&
              posts.map((post) => (
                <SocialPostListItem
                  key={post.id}
                  handleClick={() => setOpenInsightModal(true)}
                  containerClassName="flex-shrink-0"
                  conversation={post}
                />
              ))}
          </PaginatedList>
        </div>
      )}
    </div>
  );
}
