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
import { useEffect, useMemo, useState } from "react";
import { useGetInifiniteCampaigns } from "@/api/admanager";
import { RiExpandUpDownLine } from "react-icons/ri";
import { useQueryPostsByPageId } from "@/api/social";
import { useBusiness } from "@/context/BusinessContext";
import SocialPostListItem, {
  SocialPostItemShimmer,
} from "./SocialPostListItem";
import PostInsightModal from "@/components/PostInsightModal";

interface SocialPostSectionProps extends LeftPaneSectionBaseProps {}

const staticPosts = [
  {
    id: "661225f4123038d55eecbcef",
    conversation_type: "social_media_post",
    project_name: "New Convo",
    lastAdCreativeCreatedAt: "2024-04-07T05:50:10.374Z",
    businessId: "6617bf388e224e3215f60cdc",
    userId: "6544be2bf17aa96df1673fef",
    createdAt: "2024-04-07T04:50:03.799Z",
    updatedAt: "2024-04-07T05:50:10.374Z",
    Post: [
      {
        id: "662b7aa0f059cfadc458e808",
        postId: "820762918047031_749047097413912",
        pageId: "820762918047031",
        provider: "facebook",
        conversationId: "661225f4123038d55eecbcef",
        variantId: "661234141856edc0717b8b5d",
        adCreativeId: "661234131856edc0717b8b5c",
        userId: "6544be2bf17aa96df1673fef",
        createdAt: "2024-04-26T09:57:52.730Z",
        Variant: {
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/661234141856edc0717b8b5d_1712469031571.png",
          adCreativeId: "661234131856edc0717b8b5c",
          text: "Embrace the thrill! #AdventureAwaits",
          oneLiner: "Capture the Moment",
        },
      },
      {
        id: "6628ee695288da0759f46a65",
        postId: "820762918047031_747911267527495",
        pageId: "820762918047031",
        provider: "facebook",
        conversationId: "661225f4123038d55eecbcef",
        variantId: "661234141856edc0717b8b5d",
        adCreativeId: "661234131856edc0717b8b5c",
        userId: "6544be2bf17aa96df1673fef",
        createdAt: "2024-04-24T11:35:05.085Z",
        Variant: {
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/661234141856edc0717b8b5d_1712469031571.png",
          adCreativeId: "661234131856edc0717b8b5c",
          text: "Embrace the thrill! #AdventureAwaits",
          oneLiner: "Capture the Moment",
        },
      },
    ],
  },
  {
    id: "65fe1e74b306202eed19ef54",
    conversation_type: "social_media_post",
    project_name: "Hidf",
    lastAdCreativeCreatedAt: "2024-04-05T12:36:54.998Z",
    businessId: "6617bf388e224e3215f60cdc",
    userId: "6544be2bf17aa96df1673fef",
    createdAt: "2024-03-23T00:14:18.597Z",
    updatedAt: "2024-04-05T12:36:54.998Z",
    Post: [
      {
        id: "662a1c5e7beba9bfc31222e0",
        postId: "820762918047031_748443107474311",
        pageId: "820762918047031",
        provider: "facebook",
        conversationId: "65fe1e74b306202eed19ef54",
        variantId: "65fe8a2d64c213215eddf39e",
        adCreativeId: "65fe8a2d64c213215eddf39c",
        userId: "6544be2bf17aa96df1673fef",
        createdAt: "2024-04-25T09:03:26.252Z",
        Variant: {
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/65fe8a2d64c213215eddf39e_1711180357977.png",
          adCreativeId: "65fe8a2d64c213215eddf39c",
          text: "Indulge in a world of luxury and refinement with our premium solutions. Elevate your experience today by exploring our exclusive offerings.",
          oneLiner: "Elevate Your Experience!",
        },
      },
      {
        id: "6606a8c1c789f7dcd45882eb",
        postId: "820762918047031_732853472366608",
        pageId: "820762918047031",
        provider: "facebook",
        conversationId: "65fe1e74b306202eed19ef54",
        variantId: "65fe8a2d64c213215eddf39e",
        adCreativeId: "65fe8a2d64c213215eddf39c",
        userId: "6544be2bf17aa96df1673fef",
        createdAt: "2024-03-29T11:40:49.517Z",
        Variant: {
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/65fe8a2d64c213215eddf39e_1711180357977.png",
          adCreativeId: "65fe8a2d64c213215eddf39c",
          text: "Indulge in a world of luxury and refinement with our premium solutions. Elevate your experience today by exploring our exclusive offerings.",
          oneLiner: "Elevate Your Experience!",
        },
      },
    ],
  },
  {
    id: "654da5504760184dfabb29ca",
    conversation_type: "ad_creative",
    project_name: "              vxvcvxc",
    lastAdCreativeCreatedAt: "2024-04-02T07:44:34.382Z",
    businessId: "6617bf388e224e3215f60cdc",
    userId: "6544be2bf17aa96df1673fef",
    createdAt: "2023-11-10T03:36:58.731Z",
    updatedAt: "2024-04-04T13:07:54.862Z",
    Post: [
      {
        id: "65f98a0e86ff2b9615811f51",
        postId: "820762918047031_727139739604648",
        pageId: "820762918047031",
        provider: "facebook",
        conversationId: "654da5504760184dfabb29ca",
        variantId: "65dbe8944a5d8ede70107917",
        adCreativeId: "65dbe8944a5d8ede70107916",
        userId: "6544be2bf17aa96df1673fef",
        createdAt: "2024-03-19T12:50:22.369Z",
        Variant: {
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/65dbe8944a5d8ede70107917_1711178858663.png",
          adCreativeId: "65dbe8944a5d8ede70107916",
          text: "Journey into the mystical realm of our forest and awaken your sense of wonder. Let the magic of nature captivate your soul. Discover the enchantment now!",
          oneLiner: "Discover the Magic",
        },
      },
      {
        id: "65ec41b98369e10bdedc0e82",
        postId: "820762918047031_721724803479475",
        pageId: "820762918047031",
        provider: "facebook",
        conversationId: "654da5504760184dfabb29ca",
        variantId: "65dbe8944a5d8ede70107917",
        adCreativeId: "65dbe8944a5d8ede70107916",
        userId: "6544be2bf17aa96df1673fef",
        createdAt: "2024-03-18T09:15:32.405Z",
        Variant: {
          imageUrl:
            "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/65dbe8944a5d8ede70107917_1711178858663.png",
          adCreativeId: "65dbe8944a5d8ede70107916",
          text: "Journey into the mystical realm of our forest and awaken your sense of wonder. Let the magic of nature captivate your soul. Discover the enchantment now!",
          oneLiner: "Discover the Magic",
        },
      },
    ],
  },
];

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
  // const [openInsightModal, setOpenInsightModal] = useState(false);
  // const { businessMap } = useBusiness();
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

  const [useStatic, setUseStatic] = useState(true);

  useEffect(() => {
    // setUseStatic(window.localStorage.getItem("use-static-posts") === "false");
  }, []);

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
              (useStatic ? staticPosts : posts).map((post) => (
                <SocialPostListItem
                  key={post.id}
                  // handleClick={() => setOpenInsightModal(true)}
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
