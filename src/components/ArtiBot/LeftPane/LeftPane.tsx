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
import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { MdArrowBackIos } from "react-icons/md";
import ConversationListItem from "@/components/ArtiBot/LeftPane/ConversationListItem";
import AdCreativeListItem from "@/components/ArtiBot/LeftPane/AdCreativeListItem";
import CampaignListItem from "./CampaignListItem";
import { AiOutlineReload } from "react-icons/ai";
import Loader from "@/components/Loader";
import { useGetConversationInfinite } from "@/api/conversation";
import AdCreativeSection from "./AdCreativeSection";
import ConversationSection from "./ConversationSection";
import CampaignSection from "./CampaignSection";

interface LoadMoreButtonProps {
  doInfiniteScroll?: boolean;
  handleLoadMore?: () => void;
  loading?: boolean;
}
function LoadMoreButton({
  doInfiniteScroll,
  handleLoadMore,
  loading,
}: LoadMoreButtonProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleLoad = useCallback(() => {
    if (loading) return;
    handleLoadMore && handleLoadMore();
  }, [handleLoadMore, loading]);

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
  }, [doInfiniteScroll, handleLoad]);

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
export const PaginatedList: FC<PaginatedListProps> = ({
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
        <ConversationSection />
        <hr className="border-gray-700" />
        <AdCreativeSection />
        <hr className="border-gray-700" />
        <CampaignSection />
      </div>
    </div>
  );
};

export default LeftPane;
