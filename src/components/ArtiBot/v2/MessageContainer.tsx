import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import WavingHand from "@/assets/images/waving-hand.webp";
import { motion } from "framer-motion";
import { framerContainer } from "@/config/framer-motion";
import { useGetMessages } from "@/api/conversation";
import { useSearchParams } from "next/navigation";
import MessageItem from "./MessageItem";
import { Spinner } from "@nextui-org/react";
import useInView from "@/hooks/useInView";
import ClientMessages from "./ClientState/ClientMessages";

export default function MessageContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const showGetAdNowButton = false;
  const queryParams = useSearchParams();
  const conversationId = queryParams.get("conversation_id");
  const { data, hasNextPage, ...props } = useGetMessages(conversationId);
  const messages =
    data?.pages
      .map((page) => page)
      .flat()
      .reverse() || [];

  // const lastRef = useRef(null);
  const { ref: lastRef, isInView } = useInView();
  useEffect(() => {
    if (isInView && !props.isFetchingNextPage && hasNextPage) {
      props.fetchNextPage();
    }
  }, [isInView, props, hasNextPage]);

  return (
    <AnimatePresence mode="wait">
      <div
        className={
          "flex-1 flex flex-col-reverse overflow-auto " +
          (showGetAdNowButton ? " pb-9 md:pb-14" : "")
        }
        ref={containerRef}
      >
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
          {/* {conversationType && ( */}
          {/* <ChatGPTMessageWelcomeMessage type={conversationType} /> */}
          {/* )} */}
          {messages.map((messageItem) => (
            <MessageItem key={"messageItem.id"} messageItem={messageItem} />
          ))}
          <ClientMessages />
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
      </div>
    </AnimatePresence>
  );
}
