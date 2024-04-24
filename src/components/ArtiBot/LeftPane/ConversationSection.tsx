import { useGetConversationInfinite } from "@/api/conversation";
import ConversationListItem, {
  ConversationListItemShimmer,
} from "./ConversationListItem";
import {
  LeftPaneSection,
  LeftPaneSectionBaseProps,
  PaginatedList,
} from "./LeftPane";
import { useCurrentConversation } from "@/context/CurrentConversationContext";
import { RiExpandUpDownLine } from "react-icons/ri";
import { useState } from "react";

interface ConversationSectionProps extends LeftPaneSectionBaseProps {}

export default function ConversationSection(props: ConversationSectionProps) {
  const { queryConversationId } = useCurrentConversation();
  const {
    data,
    isLoading,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    ...queryProps
  } = useGetConversationInfinite(queryConversationId);
  const conversations = data?.pages.map((page) => page).flat() || [];

  return (
    <div
      className={
        "w-full my-4 flex-1 overflow-hidden flex flex-col transition-all " +
        (props.isActive ? " basis-6/12" : "")
      }
    >
      <div className="px-4 text-sm font-bold text-gray-400 flex items-center justify-between">
        <h3>Conversations</h3>
        {!props.isActive && (
          <div
            className="cursor-pointer"
            onClick={() => {
              props.onSectionActive && props.onSectionActive("conversation");
            }}
          >
            <RiExpandUpDownLine />
          </div>
        )}
      </div>
      <div
        className="mt-2 flex flex-col gap-2 overflow-auto"
        onScroll={() => {
          props.onSectionActive && props.onSectionActive("conversation");
        }}
      >
        <PaginatedList
          noMore={!hasNextPage}
          handleLoadMore={queryProps.fetchNextPage}
          loading={isLoading || isFetching || isFetchingNextPage}
          handlePrevMore={queryProps.fetchPreviousPage}
          noPrevMore={!queryProps.hasPreviousPage}
          doInfiniteScroll
        >
          {isLoading &&
            [1, 2, 3, 4].map((ind) => (
              <ConversationListItemShimmer key={ind} />
            ))}
          {conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              containerClassName={"flex-shrink-0"}
            />
          ))}
        </PaginatedList>
      </div>
    </div>
  );
}
