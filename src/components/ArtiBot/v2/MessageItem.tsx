import { ClientMessageItem, InfiniteMessage } from "@/api/conversation";
import { framerItem } from "@/config/framer-motion";
import { botData, dummyUser } from "@/constants/images";
import { ChatGPTRole } from "@/interfaces/IArtiBot";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import Image from "next/image";
import MarkdownRenderer from "../MarkdownRenderer";
import { useMemo, useState } from "react";
import { IoIosCopy } from "react-icons/io";
import Lottie from "lottie-react";
import tickAnimation from "@/assets/lottie/tick_animation.json";
import AdItem from "./AdItem/AdItem";
import { useGetMe } from "@/api/user";
import { Avatar } from "@nextui-org/react";

type MessageItemWithAdCreatives = InfiniteMessage;

type MessageItemWithoutAdCreatives = ClientMessageItem;

export type MessageItem =
  | MessageItemWithAdCreatives
  | MessageItemWithoutAdCreatives;

interface MessageItemProps {
  messageItem: MessageItem;
  size?: number;
  disableCopy?: boolean;
  isClient?: boolean;
  isActive?: boolean;
}
export default function MessageItem(props: MessageItemProps) {
  const { messageItem, size, disableCopy, isClient } = props;
  const [showCopyAnimation, setShowCopyAnimation] = useState(false);
  const { data: user } = useGetMe();

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
      {typeof messageItem.content === "string" && (
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
    item = <AdItem isClient={!!isClient} messageItem={messageItem} />;
  }

  const avatarSrc = useMemo(() => {
    return messageItem.role === ChatGPTRole.ASSISTANT
      ? botData.image.src
      : user?.image ?? dummyUser.image.src;
  }, [messageItem.role, user?.image]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={isClient ? framerItem(1, 0, 0) : framerItem()}
        // initial={{height: 0, opacity: 0}}
        // animate={{height: 'auto', opacity: 1}}
        // transition={{type: 'spring', damping: 15, duration: .15}}
        className={"w-full overflow-hidden"}
      >
        <div
          className={
            "group w-full " +
            (messageItem.role === ChatGPTRole.ASSISTANT
              ? ""
              : "bg-background bg-opacity-30")
          }
          data-message={messageItem.id}
        >
          <div className="flex items-start px-[1em] py-[0.9em] w-full max-w-[950px] mx-auto">
            <Avatar radius="sm" src={avatarSrc} />
            <div
              className={`ml-[0.8em] flex-1 overflow-hidden`}
              key={messageItem.content}
            >
              {item}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
