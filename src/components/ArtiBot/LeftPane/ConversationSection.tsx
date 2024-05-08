import { useGetConversationInfinite } from "@/api/conversation-new";
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
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ConversationSectionProps extends LeftPaneSectionBaseProps {}

export default function ConversationSection(props: ConversationSectionProps) {
  const { queryConversationId } = useCurrentConversation();
  const object = useGetConversationInfinite(queryConversationId);

  const {
    data,
    isLoading,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isSuccess,
    ...queryProps
  } = object;

  const conversations = data?.pages.map((page) => page).flat() || [];

  const router = useRouter();
  const firstConversationId = conversations[0]?.id;

  const noData = !conversations.length && !isLoading;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const ref = useRef<any>(null);

  useEffect(() => {
    ref.current = {
      pathname,
      size: searchParams.size,
    };
  }, [pathname, searchParams.size]);

  useEffect(() => {
    console.log("isFetching - ", isFetching, firstConversationId, ref.current);
    if (
      !isFetching &&
      ref.current.pathname &&
      ref.current.size === 0 &&
      firstConversationId
    ) {
      router.push("/artibot?conversation_id=" + firstConversationId);
    }
  }, [isFetching, firstConversationId, router]);

  // useEffect(() => {
  //   if (pathname === "/artibot" && searchParams.size === 0 && dataRef.current) {
  //     router.push('/artibot?conversation_id=' + )
  //   }
  // }, [pathname, searchParams.size, router]);

  return (
    <div
      className={
        "w-full my-4 flex-1 overflow-hidden flex flex-col transition-all " +
        (props.isActive && !noData ? " basis-6/12" : "")
      }
    >
      <div className="px-4 text-sm font-bold text-gray-400 flex items-center justify-between">
        <h3 data-testid="conversations-list-header">Conversations</h3>
        {!props.isActive && !noData && (
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
      {noData && (
        <div className="text-xs leading-6 transition-all px-4 py-1 mt-4 text-gray-500  flex justify-center items-center">
          <div className="flex flex-1 items-center justify-center gap-2">
            <span>No Conversations</span>
          </div>
        </div>
      )}
      {!noData && (
        <div
          className="mt-2 flex flex-col gap-2 overflow-auto"
          onMouseOver={() => {
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
      )}
    </div>
  );
}
