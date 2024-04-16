import { useGetConversationInfinite } from "@/api/conversation";
import ConversationCard, { ConversationCardShimmer } from "./ConversationCard";
import { Spinner } from "@nextui-org/react";
import useInView from "@/hooks/useInView";
import { useEffect, useMemo, useRef } from "react";
import { EmptySection, EmptySectionType } from "./CardSection";
import useCampaignStore from "@/store/campaign";
import InsightCard from "./InsightCard";
import { useGetCampaigns } from "@/api/user";
import { useGetInifiniteCampaigns } from "@/api/admanager";

export default function InsightSection() {
  const { data, isLoading, hasNextPage, ...props } = useGetInifiniteCampaigns();
  const campaigns = useMemo(
    () => data?.pages.map((page) => page.data).flat() || [],
    [data]
  );
  const { ref, isInView } = useInView();

  useEffect(() => {
    if (isInView && !props.isFetching && hasNextPage) {
      props.fetchNextPage();
    }
  }, [isInView, props, hasNextPage]);

  const waiting = isLoading && campaigns.length === 0;
  const empty = !waiting && campaigns.length === 0;
  const notEmpty = !waiting && campaigns.length > 0;

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
          campaigns.map((campaign) => (
            <InsightCard key={campaign.id} campaign={campaign} />
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
