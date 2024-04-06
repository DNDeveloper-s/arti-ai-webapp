import { useGetConversationInfinite } from "@/api/conversation";
import ConversationListItem from "./ConversationListItem";
import { PaginatedList } from "./LeftPane";

export default function ConversationSection() {
  const {
    data,
    isLoading,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    ...props
  } = useGetConversationInfinite();
  const conversations = data?.pages.map((page) => page).flat() || [];

  return (
    <div className="w-full my-4">
      <div className="px-4 text-sm font-bold text-gray-400">
        <h3>Conversations</h3>
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <PaginatedList
          noMore={!hasNextPage}
          handleLoadMore={props.fetchNextPage}
          loading={isLoading || isFetching || isFetchingNextPage}
        >
          {conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </PaginatedList>
      </div>
    </div>
  );
}
