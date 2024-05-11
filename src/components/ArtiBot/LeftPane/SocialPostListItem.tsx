import React, { FC, useEffect, useMemo, useState } from "react";
import { CardStackImages } from "@/components/ArtiBot/LeftPane/ConversationListItem";
import { ConversationGroupByPost, TimeRange } from "@/api/conversation";
import useInView from "@/hooks/useInView";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { FacebookPost } from "@/api/social";
import { extractPostInsights } from "@/components/Dashboard/v2/PostInsightCard";
import ImageTemp, {
  AppDefaultImage,
} from "@/components/shared/renderers/ImageTemp";
import { getSocialPageUrl } from "@/helpers";
import { random } from "lodash";

export const PostInsightShimmer = () => {
  return (
    <div className="grid grid-cols-[2fr_3fr_3fr] gap-3">
      <div className="flex gap-1 flex-shrink-0 flex-col">
        <span className="font-bold app-shimmer rounded text-base">64</span>
        <p className="text-[10px] app-shimmer rounded leading-[15px] max-w-[60px] text-gray-400 whitespace-pre-wrap">
          Likes
        </p>
      </div>
      <div className="flex gap-1 flex-shrink-0 flex-col">
        <span className="font-bold app-shimmer rounded text-base">$10.83</span>
        <p className="text-[10px] app-shimmer rounded leading-[15px] max-w-[60px] text-gray-400 whitespace-pre-wrap">
          Comments
        </p>
      </div>
      <div className="flex gap-1 flex-shrink-0 flex-col">
        <span className="font-bold app-shimmer rounded text-base">$693.06</span>
        <p className="text-[10px] app-shimmer rounded leading-[15px] max-w-[60px] text-gray-400 whitespace-pre-wrap">
          Shares
        </p>
      </div>
    </div>
  );
};

export const SocialPostItemShimmer = () => {
  return (
    <div
      className={
        "animate-pulse flex flex-shrink-0 flex-col gap-4 px-4 mx-2 py-3 hover:bg-gray-900 bg-gray-950 rounded text-gray-300 cursor-pointer overflow-hidden transition-all text-sm leading-6"
      }
    >
      <div className="flex gap-4 items-start ">
        <CardStackImages images={[]} />
        <span className={"app-shimmer rounded truncate"}>My one Post</span>
      </div>
      <PostInsightShimmer />
    </div>
  );
};

interface SocialPostItemProps {
  conversation: ConversationGroupByPost;
  containerClassName?: string;
  handleClick?: (postId: string) => void;
}

export const defaultTimeRange: TimeRange = [
  dayjs().subtract(7, "days"),
  dayjs(),
];



const SocialPostListItem: FC<SocialPostItemProps> = ({
  conversation,
  containerClassName,
  handleClick,
}) => {
  const router = useRouter();
  const { ref, isInView } = useInView();
  const [useStatic, setUseStatic] = useState(false);

  const latestPost = conversation.Post[0];

  // const extractedInsight = extractPostInsights(post);

  // const waitingForInsights = isLoading;
  // const noInsights = !extractedInsight;
  // const hasInsights = !!extractedInsight;

  const url = useMemo(
    () => getSocialPageUrl(conversation.id),
    [conversation.id]
  );

  const goTo = () => {
    router.push(url);
  };

  useEffect(() => {
    url && router.prefetch(url);
  }, [router, url]);

  //   useEffect(() => {}, [router]);

  return (
    <div
      onClick={goTo}
      ref={ref}
      key={conversation.id}
      className={
        "flex flex-col gap-4 px-4 mx-2 py-3 hover:bg-gray-900 bg-gray-950 rounded text-gray-300 cursor-pointer overflow-hidden transition-all text-sm leading-6 " +
        (containerClassName ?? "")
      }
    >
      <div className="flex gap-4 items-start ">
        <div className={"w-8 h-8 rounded relative flex-shrink-0"}>
          <div
            className={
              "absolute overflow-hidden top-0 left-0 w-full h-full rounded border border-gray-700"
            }
          >
            <AppDefaultImage
              width={100}
              height={100}
              className={"w-full h-full object-cover rounded"}
              src={latestPost.Variant.imageUrl}
              alt={"Carousel Image"}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <span className={"line-clamp-2 block"}>
            {latestPost.Variant.oneLiner}
          </span>
          <div className="flex gap-1 flex-shrink-0 flex-col">
            <span className="text-xs opacity-40">
              {latestPost.Variant.text}
            </span>
          </div>
          {/* {noInsights && (
            <div className="flex gap-1 flex-shrink-0 flex-col">
              <span className="text-xs opacity-40">No Insights</span>
            </div>
          )} */}
        </div>
      </div>
      {/* {waitingForInsights && <CampaignInsightShimmer />} */}
      {/* {hasInsights && (
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-3">
          <div className="flex gap-1 flex-shrink-0 flex-col">
            <span className="font-bold text-base">
              {extractedInsight.likes}
            </span>
            <p className="text-[10px] leading-[15px] max-w-[60px] text-gray-400 whitespace-pre-wrap">
              Likes
            </p>
          </div>
          <div className="flex gap-1 flex-shrink-0 flex-col">
            <span className="font-bold text-base">
              {extractedInsight.comments}
            </span>
            <p className="text-[10px] leading-[15px] max-w-[60px] text-gray-400 whitespace-pre-wrap">
              Comments
            </p>
          </div>
          <div className="flex gap-1 flex-shrink-0 flex-col">
            <span className="font-bold text-base">
              {extractedInsight.shares}
            </span>
            <p className="text-[10px] leading-[15px] max-w-[60px] text-gray-400 whitespace-pre-wrap">
              Shares
            </p>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default SocialPostListItem;
