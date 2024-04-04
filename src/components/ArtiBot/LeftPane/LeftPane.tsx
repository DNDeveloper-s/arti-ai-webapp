"use client";

import CTAButton from "@/components/CTAButton";
import {
  getAdCreatives,
  getConversations,
  useConversation,
} from "@/context/ConversationContext";
import { getConversationURL } from "@/helpers";
import useAdCreatives from "@/hooks/useAdCreatives";
import useConversations from "@/hooks/useConversations";
import useSessionToken from "@/hooks/useSessionToken";
import { ConversationType } from "@/interfaces/IConversation";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { MdArrowBackIos } from "react-icons/md";
import ConversationListItem from "@/components/ArtiBot/LeftPane/ConversationListItem";
import AdCreativeListItem from "@/components/ArtiBot/LeftPane/AdCreativeListItem";
import CampaignListItem from "./CampaignListItem";
import { AiOutlineReload } from "react-icons/ai";
import Loader from "@/components/Loader";
import { useGetConversationInfinite } from "@/api/conversation";

interface LoadMoreButtonProps {
  doInfiniteScroll?: boolean;
  handleLoadMore?: () => void;
}
function LoadMoreButton({
  doInfiniteScroll,
  handleLoadMore,
}: LoadMoreButtonProps) {
  const [loading, setLoading] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  function handleLoad() {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      handleLoadMore && handleLoadMore();
      setLoading(false);
    }, 2000);
  }

  useEffect(() => {
    if (doInfiniteScroll) {
      const containerEl = containerRef.current;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting === true) {
            handleLoad();
          }
        },
        { threshold: 0.5 }
      );
      containerEl && observer.observe(containerEl);

      return () => {
        containerEl && observer.unobserve(containerEl);
      };
    }
  }, [doInfiniteScroll]);

  return (
    <div
      onClick={handleLoad}
      ref={containerRef}
      className="text-xs leading-6 transition-all px-4 py-1 text-gray-500 cursor-pointer hover:bg-gray-800 bg-gray-900 rounded mx-2 flex justify-center items-center"
    >
      <div className="flex flex-1 items-center justify-center gap-2">
        <div className="text-sm">
          {loading ? <Loader className="w-3 h-3" /> : <AiOutlineReload />}
        </div>
        <span>{loading ? "Loading" : "Load More"}</span>
      </div>
    </div>
  );
}

interface PaginatedListProps extends LoadMoreButtonProps {
  children: ReactNode;
  noMore?: boolean;
}
const PaginatedList: FC<PaginatedListProps> = ({
  children,
  noMore,
  ...props
}) => {
  return (
    <>
      {children}
      {children && !noMore && <LoadMoreButton {...props} />}
      {noMore && (
        <div className="text-xs leading-6 transition-all px-4 py-1 text-gray-500 bg-gray-950 rounded mx-2 flex justify-center items-center">
          <div className="flex flex-1 items-center justify-center gap-2">
            <span>End of the list</span>
          </div>
        </div>
      )}
    </>
  );
};

interface LeftPaneProps {}

const LeftPane: FC<LeftPaneProps> = (props) => {
  const router = useRouter();
  const { data } = useGetConversationInfinite();
  const conversations = data?.pages.map((page) => page).flat() || [];
  const {
    adVariantsByConversationId,
    getLastAdCreativeByConversationId,
    sortedConversationIds,
  } = useAdCreatives();
  const { state, dispatch } = useConversation();
  const token = useSessionToken();
  const params = useParams();
  const search = useSearchParams();

  const [cursor, setCursor] = useState<number>(5);
  const [noMore, setNoMore] = useState<boolean>(false);

  const [cursorA, setCursorA] = useState<number>(5);
  const [noMoreA, setNoMoreA] = useState<boolean>(false);

  const [cursorC, setCursorC] = useState<number>(5);
  const [noMoreC, setNoMoreC] = useState<boolean>(false);

  useEffect(() => {
    // token && dispatch && getConversations(dispatch);
    // token && dispatch && getAdCreatives(dispatch);
  }, [dispatch, token]);

  function handleLoadMoreConversations() {
    const newCursor = cursor + 5;
    setCursor(newCursor);
    if (!conversations || newCursor >= conversations?.length) setNoMore(true);
    else setNoMore(false);
  }

  function handleLoadMoreAdCreatives() {
    const newCursor = cursorA + 5;
    setCursorA(newCursor);
    if (!sortedConversationIds || newCursor >= sortedConversationIds?.length)
      setNoMoreA(true);
    else setNoMoreA(false);
  }

  function handleLoadMoreCampaigns() {
    const newCursor = cursorC + 5;
    setCursorC(newCursor);
    if (!sortedConversationIds || newCursor >= sortedConversationIds?.length)
      setNoMoreC(true);
    else setNoMoreC(false);
  }

  return (
    <div className="flex flex-col w-[250px] h-full overflow-hidden">
      <div
        className="w-full flex items-center cursor-pointer px-4 py-6"
        onClick={() => router.push("/")}
      >
        <MdArrowBackIos style={{ fontSize: "21px" }} />
        <span className="ml-0.5 -mb-0.5 text-white text-opacity-60">
          Dashboard
        </span>
      </div>
      <hr className="border-gray-700" />
      <Link href={"/artibot"} className="block w-full my-3" prefetch={true}>
        <button className="mx-auto py-2 px-4 flex gap-2 text-sm items-center breathing-button-primary bg-primary rounded">
          <BiSolidEdit />
          <span>New Conversation</span>
        </button>
      </Link>
      <hr className="border-gray-700" />
      <div className={"relative overflow-auto w-full"}>
        <div className="w-full my-4">
          <div className="px-4 text-sm font-bold text-gray-400">
            <h3>Conversations</h3>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            {conversations && conversations.length > 0 && (
              <PaginatedList
                noMore={noMore}
                handleLoadMore={handleLoadMoreConversations}
              >
                {conversations.slice(0, cursor).map((conversation) => (
                  <ConversationListItem
                    key={conversation.id}
                    conversation={conversation}
                  />
                ))}
              </PaginatedList>
            )}
          </div>
        </div>
        <hr className="border-gray-700" />
        <div className="w-full my-4">
          <div className="px-4 text-sm font-bold text-gray-400">
            <h3>Ad Creatives</h3>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <PaginatedList
              noMore={noMoreA}
              handleLoadMore={handleLoadMoreAdCreatives}
            >
              {sortedConversationIds
                .slice(0, cursorA)
                .map((conversationId: string) => (
                  <AdCreativeListItem
                    key={conversationId}
                    conversationId={conversationId}
                  />
                ))}
            </PaginatedList>
          </div>
        </div>
        <hr className="border-gray-700" />
        <div className="w-full my-4">
          <div className="px-4 text-sm font-bold text-gray-400">
            <h3>Campaigns</h3>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <PaginatedList doInfiniteScroll={true}>
              {sortedConversationIds
                .slice(0, cursorC)
                .map((conversationId: string) => (
                  <CampaignListItem
                    key={conversationId}
                    conversationId={conversationId}
                  />
                ))}
            </PaginatedList>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPane;
