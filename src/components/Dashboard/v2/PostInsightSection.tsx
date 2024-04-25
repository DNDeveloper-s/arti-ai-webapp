import { ConversationCardShimmer } from "./ConversationCard";
import { Spinner } from "@nextui-org/react";
import useInView from "@/hooks/useInView";
import { useEffect, useMemo, useRef } from "react";
import { EmptySection, EmptySectionType } from "./CardSection";
import InsightCard from "./InsightCard";
import { useGetCampaigns } from "@/api/user";
import dayjs from "dayjs";
import { useQueryPostsByPageId } from "@/api/social";
import { useBusiness } from "@/context/BusinessContext";
import PostInsightCard from "./PostInsightCard";

export default function PostInsightSection() {
  const { businessMap } = useBusiness();
  const { posts, isLoading, hasNextPage, ...props } = useQueryPostsByPageId(
    businessMap.getFacebookPage()?.provider_id
  );
  console.log(
    "businessMap.getFacebookPage()?.provider_id - ",
    businessMap.getFacebookPage()?.provider_id
  );
  const {
    posts: last7DaysPosts,
    isLoading: is7DaysLoading,
    hasNextPage: has7DaysNextPage,
    ...props7Days
  } = useQueryPostsByPageId(businessMap.getFacebookPage()?.provider_id, "week");

  const { ref, isInView } = useInView();

  useEffect(() => {
    if (isInView && !props.isFetching && hasNextPage) {
      props.fetchNextPage();
    }
  }, [isInView, props, hasNextPage]);

  useEffect(() => {
    if (isInView && !props7Days.isFetching && has7DaysNextPage) {
      props7Days.fetchNextPage();
    }
  }, [isInView, props7Days, has7DaysNextPage]);

  const waiting = isLoading && posts.length === 0;
  const empty = !waiting && posts.length === 0;
  const notEmpty = !waiting && posts.length > 0;

  return (
    <section className="mb-10 w-full">
      <div className="flex mb-3 justify-between items-center">
        <h2>Insights</h2>
      </div>
      <div className="flex items-center gap-4 w-full overflow-x-auto">
        {/* {renderConversations()} */}
        {waiting && (
          <div className="w-full flex gap-4 overflow-hidden">
            <ConversationCardShimmer />
            <ConversationCardShimmer />
            <ConversationCardShimmer />
          </div>
        )}
        {empty && (
          <EmptySection
            style={{
              backdropFilter: "blur(3px)",
              background: "rgba(0,0,0,0.6)",
            }}
            type={EmptySectionType.CONVERSATION}
          />
        )}
        {notEmpty &&
          posts.map((post) => (
            <PostInsightCard
              key={post.id}
              post={post}
              last7Day={last7DaysPosts.find((c) => c.id === post.id)}
            />
          ))}
        {hasNextPage && (
          <div
            className="w-[60px] p-0 pr-[20px] h-full flex items-center justify-center"
            ref={ref}
          >
            <Spinner />
          </div>
        )}
      </div>
    </section>
  );
}
