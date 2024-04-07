import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import WavingHand from "@/assets/images/waving-hand.webp";
import { motion } from "framer-motion";
import { framerContainer } from "@/config/framer-motion";
import { useGetMessages } from "@/api/conversation";
import { useSearchParams } from "next/navigation";
import MessageItem from "./MessageItem";
import { Spinner } from "@nextui-org/react";
import useInView from "@/hooks/useInView";
import ClientMessages from "./ClientState/ClientMessages";
import { useCurrentConversation } from "@/context/CurrentConversationContext";
import { useClientMessages } from "@/context/ClientMessageContext";
import { sortBy, uniqBy } from "lodash";
import {
  ChatGPTMessageCreatingAd,
  ChatGPTMessageGeneratingAnimation,
  ChatGPTMessageWelcomeMessage,
} from "../MessageItems/ChatGPTMessageItem";
import useKeepInView from "@/hooks/useKeepInView";
import MessagesShimmer from "./MessagesShimmer";
import { ConversationType } from "@/interfaces/IConversation";

export default function MessageContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const showGetAdNowButton = false;
  const queryParams = useSearchParams();
  const { conversation } = useCurrentConversation();
  const conversationId = conversation?.id;
  const { data, hasNextPage, isLoading, ...props } = useGetMessages(
    conversationId ?? null
  );
  const serverMessages = useMemo(() => {
    return (
      data?.pages
        .map((page) => page)
        .flat()
        .reverse() || []
    );
  }, [data]);

  // const lastRef = useRef(null);
  const { ref: lastRef, isInView } = useInView();
  const { ref: keepInViewRef, setKeepInView } = useKeepInView();

  useEffect(() => {
    if (isInView && !props.isFetching && hasNextPage) {
      props.fetchNextPage();
    }
  }, [isInView, props, hasNextPage]);

  const { messageRecord, isPending, isGeneratingJson } = useClientMessages();

  const messages = useMemo(() => {
    const clientMessages = messageRecord.getByConversationId(conversation?.id);
    return sortBy(uniqBy([...serverMessages, ...clientMessages], "id"), "id");
  }, [messageRecord, conversation?.id, serverMessages]);

  useEffect(() => {
    setKeepInView(!!isPending);
  }, [isPending, setKeepInView]);

  return (
    <AnimatePresence mode="wait">
      <div
        className={
          "flex-1 flex flex-col-reverse overflow-auto " +
          (showGetAdNowButton ? " pb-9 md:pb-14" : "")
        }
        ref={containerRef}
      >
        {isLoading ? (
          <div>
            <MessagesShimmer
              conversationType={
                conversation?.conversation_type ?? ConversationType.AD_CREATIVE
              }
            />
          </div>
        ) : (
          <>
            {/*<ChatGPTMessageCreatingAd/>*/}
            {/* {isGeneratingAd && <ChatGPTMessageCreatingAd />} */}
            {/* <div className="text-white whitespace-pre-wrap">{msg}</div> */}
            {/* {isGenerating && <ChatGPTMessageGeneratingAnimation />} */}
            <motion.div
              variants={framerContainer}
              animate="show"
              initial="hidden"
              exit="hidden"
            >
              {!hasNextPage && conversation?.conversation_type && (
                <ChatGPTMessageWelcomeMessage
                  type={conversation?.conversation_type}
                />
              )}
              {messages.map((messageItem) => (
                <MessageItem key={messageItem.id} messageItem={messageItem} />
              ))}

              {/* {isPending && <ChatGPTMessageGeneratingAnimation />} */}
              {isGeneratingJson && (
                <ChatGPTMessageCreatingAd hideProfilePic={true} />
              )}
              <div ref={keepInViewRef} />
              {/* <ClientMessages /> */}
            </motion.div>
            {hasNextPage && (
              <div
                ref={lastRef}
                className="w-full max-w-[900px] mx-auto px-3 flex justify-center items-center my-3"
              >
                <Spinner />
              </div>
            )}
            {!hasNextPage && (
              <div className="w-full max-w-[900px] mx-auto px-3 flex justify-center items-center my-3">
                <div className="h-0.5 mr-5 flex-1 bg-gray-800" />
                <div className="flex justify-center items-center font-light text-sm font-diatype text-white text-opacity-50">
                  <span>Hey</span>
                  <Image
                    width={20}
                    height={20}
                    src={WavingHand}
                    alt="Arti AI welcomes you"
                  />
                  <span>, How can Arti Ai help you?</span>
                </div>
                <div className="h-0.5 ml-5 flex-1 bg-gray-800" />
              </div>
            )}
          </>
        )}
      </div>
    </AnimatePresence>
  );
}
