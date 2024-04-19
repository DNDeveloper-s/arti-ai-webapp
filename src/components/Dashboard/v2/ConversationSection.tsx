import { useGetConversationInfinite } from "@/api/conversation";
import ConversationCard, { ConversationCardShimmer } from "./ConversationCard";
import { Spinner } from "@nextui-org/react";
import useInView from "@/hooks/useInView";
import { useEffect, useRef } from "react";
import { EmptySection, EmptySectionType } from "./CardSection";
import { useCurrentConversation } from "@/context/CurrentConversationContext";

export default function ConversationSection() {
  const { data, isLoading, hasNextPage, ...props } =
    useGetConversationInfinite();
  const conversations = data?.pages.map((page) => page).flat() || [];
  const { ref, isInView } = useInView();
  const { ref: firstRef, isInView: isFirstInView } = useInView();

  useEffect(() => {
    if (isInView && !props.isFetching && hasNextPage) {
      props.fetchNextPage();
    }
  }, [isInView, props, hasNextPage]);

  useEffect(() => {
    if (isFirstInView && !props.isFetching && props.hasPreviousPage) {
      props.fetchPreviousPage();
    }
  }, [isFirstInView, props]);

  const waiting = isLoading && conversations.length === 0;
  const empty = !waiting && conversations.length === 0;
  const notEmpty = !waiting && conversations.length > 0;

  return (
    <section className="mb-10 w-full">
      <div className="flex mb-3 justify-between items-center">
        <h2>Past Conversations</h2>
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
        {props.hasPreviousPage && (
          <div
            className="w-[60px] p-0 pr-[20px] h-full flex items-center justify-center"
            ref={firstRef}
          >
            <Spinner />
          </div>
        )}
        {notEmpty &&
          conversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
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
