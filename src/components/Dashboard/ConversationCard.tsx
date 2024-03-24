"use client";

import React from "react";
import { ConversationType, IConversation } from "@/interfaces/IConversation";
import { getConversationURL, timeSince } from "@/helpers";
import Link from "next/link";
import useMounted from "@/hooks/useMounted";
import ChatGPTMessageItem, {
  ChatGPTMessageItemShimmer,
} from "@/components/ArtiBot/MessageItems/ChatGPTMessageItem";
import StrategyIcon from "@/components/shared/icons/StrategyIcon";
import { colors } from "@/config/theme";
import AdCreativeIcon from "@/components/shared/icons/AdCreativeIcon";

export const ConversationCardShimmer = () => {
  return (
    <div
      className={
        "animate-pulse w-[25rem] flex-shrink-0 h-[13rem] relative border-2 border-secondaryBackground transition-all rounded-xl overflow-hidden text-[9px] bg-secondaryBackground"
      }
    >
      <div className="w-full h-full absolute top-0 z-10 left-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.00)_55.23%,_rgba(0,0,0,0.61)_77%,_rgba(0,0,0,0.82)_100%)]" />
      <div className="py-3 px-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/*<span className="app-shimmer w-4 h-5 rounded">*/}
          {/*	/!*<StrategyIcon fill={colors.primary} />*!/*/}
          {/*</span>*/}
          <h2 className="app-shimmer rounded text-base font-medium text-primary">
            {"Ad Creative | Project Name"}
          </h2>
        </div>
        <span>
          {/*<span className="text-white text-opacity-30 text-[1.1em]">Last Activity:</span>*/}
          <span className="app-shimmer rounded text-primary text-[1.1em] ml-1">
            3 seconds ago
          </span>
        </span>
      </div>
      <div className="flex flex-col-reverse">
        {/*{props.conversation.messages.map(messageItem => <ChatGPTMessageItem disableCopy size={20} key={messageItem.id} messageItem={messageItem} variantFontSize={10} />)}*/}
        <ChatGPTMessageItemShimmer size={20} />
        <ChatGPTMessageItemShimmer size={20} />
        <ChatGPTMessageItemShimmer size={20} />
        <ChatGPTMessageItemShimmer size={20} />
      </div>
    </div>
  );
};

interface ConversationCardProps {
  conversation: IConversation;
}

const ConversationCard: React.FC<ConversationCardProps> = (props) => {
  const mounted = useMounted();

  const sortedMessages = props.conversation.messages.sort((a, b) => {
    if (a.updatedAt > b.updatedAt) return 1;
    if (a.updatedAt < b.updatedAt) return -1;
    return 0;
  });

  return (
    <Link
      href={getConversationURL(props.conversation.id, props.conversation)}
      prefetch={true}
    >
      <div
        className={
          "w-[25rem] flex-shrink-0 h-[13rem] relative border-2 border-secondaryBackground transition-all cursor-pointer hover:border-primary rounded-xl overflow-hidden text-[9px] bg-secondaryBackground"
        }
      >
        <div className="w-full h-full absolute top-0 z-10 left-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.00)_55.23%,_rgba(0,0,0,0.61)_77%,_rgba(0,0,0,0.82)_100%)]" />
        <div className="py-3 px-3 flex items-center justify-between">
          {/*<div className="flex items-center gap-3">*/}
          {/*<span className="w-4">*/}
          {/*	{props.conversation.conversation_type === ConversationType.STRATEGY ?*/}
          {/*		<StrategyIcon fill={colors.primary} />*/}
          {/*		: <AdCreativeIcon fill={colors.primary} />*/}
          {/*	}*/}
          {/*</span>*/}
          {/*</div>*/}
          <h2 className="whitespace-nowrap w-full overflow-hidden overflow-ellipsis mr-5 text-base font-medium text-primary">
            {props.conversation.conversation_type ===
            ConversationType.AD_CREATIVE
              ? "Ad Creative"
              : "Social Media Post"}{" "}
            | {props.conversation.project_name}
          </h2>
          {/*<div className="flex items-center gap-3">*/}
          {/*	<h2 className="text-base font-medium text-primary">{'New Chat'}</h2>*/}
          {/*	<div className="flex gap-1 items-center">*/}
          {/*	<span className="w-3">*/}
          {/*		<AdCreativeIcon fill="white" />*/}
          {/*	</span>*/}
          {/*		<span>Ad Creative</span>*/}
          {/*	</div>*/}
          {/*</div>*/}
          <span className="whitespace-nowrap">
            <span className="text-white text-opacity-30 text-[1.1em]">
              Last Activity:
            </span>
            {mounted && (
              <span className="text-primary text-[1.1em] ml-1">
                {timeSince(props.conversation.updatedAt) + " ago"}
              </span>
            )}
          </span>
        </div>
        <div className="flex flex-col-reverse">
          {sortedMessages.map((messageItem) => (
            <ChatGPTMessageItem
              disableCopy
              size={20}
              key={messageItem.id}
              messageItem={messageItem}
              variantFontSize={10}
              isGenerating={false}
              setMessages={() => {}}
            />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ConversationCard;
