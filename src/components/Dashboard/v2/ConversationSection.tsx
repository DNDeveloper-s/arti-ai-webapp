import { useGetConversationInfinite } from "@/api/conversation";
import ConversationCard, {
  ConversationCardShimmer,
} from "./ConversationCardNew";
import { Spinner } from "@nextui-org/react";
import useInView from "@/hooks/useInView";
import { useEffect, useRef } from "react";

export default function ConversationSection() {
  const { data, isLoading, hasNextPage, ...props } =
    useGetConversationInfinite();
  const conversations = data?.pages.map((page) => page).flat() || [];
  const lastRef = useRef(null);
  const isInView = useInView(lastRef);

  useEffect(() => {
    console.log("isInView - ", isInView, props.isFetchingNextPage);
    if (isInView && !props.isFetchingNextPage) {
      props.fetchNextPage();
    }
  }, [isInView, props]);

  return (
    <div className="flex items-center gap-4 w-full overflow-x-auto">
      {/* {renderConversations()} */}
      {isLoading && (
        <div className="w-full flex gap-4 overflow-hidden">
          <ConversationCardShimmer />
          <ConversationCardShimmer />
          <ConversationCardShimmer />
        </div>
      )}
      {conversations.map((conversation) => (
        <ConversationCard key={conversation.id} conversation={conversation} />
      ))}
      {hasNextPage && (
        <div
          className="w-8 h-full flex items-center justify-center"
          ref={lastRef}
        >
          <Spinner />
        </div>
      )}
    </div>
  );
}
