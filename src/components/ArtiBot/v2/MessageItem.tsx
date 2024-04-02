import { InfiniteMessage } from "@/api/conversation";
import { framerItem } from "@/config/framer-motion";
import { botData, dummyUser } from "@/constants/images";
import { ChatGPTRole } from "@/interfaces/IArtiBot";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import Image from "next/image";
import MarkdownRenderer from "../MarkdownRenderer";
import { useState } from "react";
import { IoIosCopy } from "react-icons/io";
import Lottie from "lottie-react";
import tickAnimation from "@/assets/lottie/tick_animation.json";
import AdItem from "./AdItem";

interface MessageItemProps {
  messageItem: InfiniteMessage;
  size?: number;
  disableCopy?: boolean;
}
export default function MessageItem(props: MessageItemProps) {
  const { messageItem, size, disableCopy } = props;
  const [showCopyAnimation, setShowCopyAnimation] = useState(false);

  async function copyTextToClipboard(text: string) {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(text);
    } else {
      document.execCommand("copy", true, text);
    }
    setShowCopyAnimation(true);
    setTimeout(() => {
      setShowCopyAnimation(false);
    }, 2000);
    return;
  }

  let item = (
    <div className="flex items-start">
      {messageItem.content && (
        <p className="whitespace-pre-wrap text-[1em] text-primaryText opacity-60 flex-1">
          <MarkdownRenderer markdownContent={messageItem.content} />
        </p>
      )}
      {!disableCopy && (
        <div className="w-[1.85em] h-[1.85em] mx-[1em] flex items-center justify-center relative">
          {!showCopyAnimation ? (
            <IoIosCopy
              className="group-hover:opacity-100 opacity-0 transition-all cursor-pointer justify-self-end text-primary"
              onClick={() =>
                messageItem &&
                messageItem.content &&
                copyTextToClipboard(messageItem.content)
              }
            />
          ) : (
            <Lottie
              onAnimationEnd={() => setShowCopyAnimation(false)}
              className="absolute top-1/2 left-1/2 w-20 h-20 transform -translate-x-1/2 -translate-y-1/2"
              animationData={tickAnimation}
              loop={false}
            />
          )}
        </div>
      )}
    </div>
  );

  if (messageItem.adCreatives && messageItem.adCreatives.length > 0) {
    // addAdCreatives(dispatch, adCreatives);
    item = <AdItem messageItem={messageItem} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={framerItem()}
        // initial={{height: 0, opacity: 0}}
        // animate={{height: 'auto', opacity: 1}}
        // transition={{type: 'spring', damping: 15, duration: .15}}
        className={"w-full overflow-hidden"}
      >
        <div
          key={messageItem.content}
          className={
            "group w-full " +
            (messageItem.role === ChatGPTRole.ASSISTANT
              ? ""
              : "bg-background bg-opacity-30")
          }
        >
          <div className="flex items-start px-[1em] py-[0.9em] w-full max-w-[950px] mx-auto">
            <Image
              className="rounded-lg mr-[0.3em]"
              width={size ?? 50}
              height={size ?? 50}
              src={
                messageItem.role === ChatGPTRole.ASSISTANT
                  ? botData.image
                  : dummyUser.image
              }
              alt=""
            />
            <div className={`ml-[0.8em] flex-1 overflow-hidden`}>{item}</div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
