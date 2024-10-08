"use client";

import {
  AdJSONInput,
  ChatGPTMessageObj,
  ChatGPTRole,
} from "@/interfaces/IArtiBot";
import React, {
  Dispatch,
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoIosCopy } from "react-icons/io";
import Lottie from "lottie-react";
import tickAnimation from "@/assets/lottie/tick_animation.json";
import getJSONObjectFromAString, { isValidJsonWithAdsArray } from "@/helpers";
import Image from "next/image";
import { botData, dummyUser } from "@/constants/images";
import AdItem from "@/components/ArtiBot/MessageItems/AdItem";
import { addAdCreatives, useConversation } from "@/context/ConversationContext";
import { IAdCreative } from "@/interfaces/IAdCreative";
import { dummyEssay } from "@/constants/dummy";
import { ConversationType } from "@/interfaces/IConversation";
import generatingAdJSON from "@/assets/lottie/generating_image.json";
import { AnimatePresence, motion } from "framer-motion";
import typingAnimation from "@/assets/lottie/typing.json";
import { framerItem } from "@/config/framer-motion";
import useMounted from "@/hooks/useMounted";
import MarkdownRenderer from "@/components/ArtiBot/MarkdownRenderer";
import { Mock } from "@/constants/servicesData";
import { useBusiness } from "@/context/BusinessContext";
import Element from "@/components/shared/renderers/Element";

interface ChatGPTMessageItemProps {
  messageItem: ChatGPTMessageObj;
  isGenerating?: boolean;
  disableCopy?: boolean;
  size?: number;
  variantFontSize?: number;
  isMock?: boolean;
  conversationId?: string;
  chunksRef?: React.MutableRefObject<string>;
  doneRef?: React.MutableRefObject<boolean>;
  setMessages: Dispatch<React.SetStateAction<ChatGPTMessageObj[]>>;
}

interface RenderMessageItemProps {
  messageItem: ChatGPTMessageObj;
  setMessages: Dispatch<React.SetStateAction<ChatGPTMessageObj[]>>;
  chunksRef?: React.MutableRefObject<string>;
  doneRef?: React.MutableRefObject<boolean>;
}
function RenderMessageItem({
  chunksRef,
  doneRef,
  setMessages,
  messageItem,
}: RenderMessageItemProps) {
  const animationFrameRef = useRef<number>(0);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [markdownChunks, setMarkdownChunks] = useState("");
  const [renderedChunks, setRenderedChunks] = useState([]);
  const lastItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // if(!doneRef || !chunksRef || !messageItem || !setMessages) return;
    let j = 0;
    let prevJ = 0;
    let frame = 0;
    // const interval = setInterval(, 200);
    function step() {
      if (!doneRef || !chunksRef || !messageItem || !setMessages) return;
      // Shift the cursor to next index when the chunks array has more chunks
      if (chunksRef.current.length >= j && frame === 15) {
        j += 15;
        frame = 0;

        const message = chunksRef.current.slice(0, j);
        setMarkdownChunks(message);
        // textContainerRef.current.innerHTML += message;
        // console.log('message - ', message);
        // processSSEChunk(message);
        // setMarkdownChunks(c => [...c, message]);
      }
      // setItem(c => message);

      // Clear the interval when the chunks array is done and the message is fully typed
      if (doneRef.current && chunksRef.current.length < j) {
        // clearInterval(interval);
        setMessages((_messages) => {
          const messages = [..._messages];
          const index = messages.findIndex((m) => m.id === messageItem.id);
          messages[index] = {
            ...messageItem,
            generating: false,
            content: chunksRef.current,
          };
          return messages;
        });
        cancelAnimationFrame(animationFrameRef.current);
      }

      prevJ = j;
      frame += 1;
      animationFrameRef.current = requestAnimationFrame(step);
    }

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      // clearInterval(interval);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [chunksRef, doneRef, messageItem, setMessages]);

  useEffect(() => {
    // console.log("markdownChunks - ", markdownChunks, messageItem);
    // lastItemRef.current && lastItemRef.current.scrollIntoView({behavior: 'smooth'});
  }, [markdownChunks, messageItem]);

  return (
    // <Markdown source={item} />
    // <HandleRenderMessageItem item={item} />
    <div>
      <div>
        <MarkdownRenderer markdownContent={markdownChunks} />
      </div>
      <div ref={lastItemRef} />
    </div>
  );
}

function GeneratingMessageItem({
  isMock,
  setMessages,
  messageItem,
  chunksRef,
  doneRef,
}: {
  isMock?: boolean;
  messageItem: ChatGPTMessageObj;
  setMessages: Dispatch<React.SetStateAction<ChatGPTMessageObj[]>>;
  chunksRef?: React.MutableRefObject<string>;
  doneRef?: React.MutableRefObject<boolean>;
}) {
  return (
    <div className="flex items-start">
      <p
        className={`whitespace-pre-wrap text-[${isMock ? "11px" : "1em"}] text-primaryText text-opacity-60 flex-1`}
      >
        <RenderMessageItem
          setMessages={setMessages}
          messageItem={messageItem}
          chunksRef={chunksRef}
          doneRef={doneRef}
        />
      </p>
      {!isMock && (
        <div className="w-[1.85em] h-[1.85em] mx-[1em] flex items-center justify-center relative">
          <IoIosCopy className="cursor-pointer opacity-0 pointer-events-none justify-self-end text-primary" />
        </div>
      )}
    </div>
  );
}

// Create an array of random message lengths
const randomMessageLengthForShimmer = [
  "Hey How can I help you? I am Arti Ai your personal assistant. I can help you with your ads and I can help you with your ads. Some more text here",
  "Hey, How can I help you?",
  "Hey, How can I help you? I am Arti Ai",
  "Hey, How can I help you? I am Arti Ai, your personal assistant",
  "Hey, How can I help you? I am Arti Ai, your personal assistant. I can help you with your ads",
  "Hey, How can I help you? I am Arti Ai, your personal assistant. I can help you with your ads. I can help you with your ads",
];

// Generate a function to choose random index from the array
const randomIndex = () =>
  Math.floor(Math.random() * randomMessageLengthForShimmer.length);

export const ChatGPTMessageItemShimmer = ({ size = 45 }) => {
  const mounted = useMounted();
  const message = useMemo(() => {
    return randomMessageLengthForShimmer[randomIndex()];
  }, []);
  return (
    <div className={"w-full"}>
      <div className="flex items-start px-[1em] py-[0.9em] w-full max-w-[950px] mx-auto">
        <div
          className={"app-shimmer rounded-lg mr-[0.3em] " + `w-[20px] h-[20px]`}
        />
        {/*<Image className="rounded-lg mr-[0.3em]" width={45} height={45} src={botData.image} alt=""/>*/}
        <div className="ml-[0.8em] flex-1">
          <span className="app-shimmer">
            {!mounted ? randomMessageLengthForShimmer[1] : message}
          </span>
        </div>
      </div>
    </div>
  );
};

export const welcomeMessage = {
  [ConversationType.AD_CREATIVE]:
    "Hello! I am Arti, an AI with a background in advertising. I can assist you in crafting captivating advertisements for various platforms. May I please know your name and your role in this project? Additionally, could you let me know the type of ad you wish to create and where you intend to display these ads?",
  [ConversationType.STRATEGY]:
    "Hello! I am Arti, an AI with proficiency in consultancy. I am here to help you understand key SWOT parameters for your business, provide insights on how to improve your marketing, digital presence, and overall offering. May I know your name, profession, and what your business is about?",
  [ConversationType.SOCIAL_MEDIA_POST]:
    "Hello! I'm Arti, your AI assistant for social media management. 🌟 Whether you're promoting your business or sharing personal updates, I'm here to make it easy. Let's craft eye-catching posts and schedule them for optimal engagement. To get started, could you please tell me your name and what you're looking to achieve with your social media presence? Additionally, let me know which platforms you'd like to target and any specific ideas you have in mind for your posts. Let's elevate your social media game together! 🚀",

  "": "Hello! I am Arti, an AI with a background in creating social media content. I can assist you in crafting captivating social media posts for various platforms. May I please know your name and your role in this project? Additionally, could you let me know the type of post you wish to create and where you intend to display these posts?  ",
};

export const ChatGPTMessageWelcomeMessage = ({
  size = 45,
  type = ConversationType.AD_CREATIVE,
}) => {
  const [showCopyAnimation, setShowCopyAnimation] = useState(false);
  const { business } = useBusiness();

  const message = useMemo(() => {
    return randomMessageLengthForShimmer[randomIndex()];
  }, []);

  const key =
    type === ConversationType.AD_CREATIVE ? "ad_creative" : "post_creative";

  return (
    <Element content={business?.conversation_starter?.[key]}>
      <motion.div variants={framerItem()} className={"w-full"}>
        <div
          className="flex items-start px-[1em] py-[0.9em] w-full max-w-[950px] mx-auto"
          data-testid="conversation-message-item"
          data-messagetype="welcome-message"
        >
          <Image
            className="rounded-lg mr-[0.3em]"
            width={45}
            height={45}
            src={botData.image}
            alt=""
          />
          <div className="ml-[0.8em] flex-1">
            <div className="flex items-start">
              <p className="whitespace-pre-wrap text-[15px] leading-[1.8] text-primaryText opacity-60 flex-1">
                {business?.conversation_starter?.[key]}
              </p>
              <div className="opacity-0 pointer-events-none w-[1.85em] h-[1.85em] mx-[1em] flex items-center justify-center relative">
                {!showCopyAnimation ? (
                  <IoIosCopy className="cursor-pointer justify-self-end text-primary" />
                ) : (
                  <Lottie
                    className="absolute top-1/2 left-1/2 w-20 h-20 transform -translate-x-1/2 -translate-y-1/2"
                    animationData={tickAnimation}
                    loop={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Element>
  );
};

export const ChatGPTMessageCreatingAd = ({
  size = 45,
  hideProfilePic = false,
}) => {
  const message = useMemo(() => {
    return randomMessageLengthForShimmer[randomIndex()];
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        transition={{ type: "spring", damping: 10 }}
        className={"w-full"}
      >
        <div className="flex items-start px-[1em] py-[0.9em] w-full max-w-[950px] mx-auto">
          <Image
            className={
              "rounded-lg mr-[0.3em] " + (hideProfilePic ? "opacity-0" : "")
            }
            width={45}
            height={45}
            src={botData.image}
            alt=""
          />
          <div className="ml-[0.8em] flex-1">
            <div className="flex items-start">
              <span className="relative breathing-button rounded-xl">
                <span className="z-10 flex gap-2 p-3 rounded-xl border-2 border-primary border-opacity-20 bg-secondaryText bg-opacity-10 shadow w-full max-w-[350px]">
                  <span className="h-[44px] aspect-square bg-black rounded-xl flex items-center justify-center">
                    <span className="w-7 h-7 flex items-center justify-center">
                      <Lottie animationData={generatingAdJSON} loop={true} />
                    </span>
                  </span>
                  <span className="flex flex-col">
                    <span className="leading-tight">Arti Ai</span>
                    <span className="mt-0.5 text-gray-500 text-sm">
                      Generating Ad Creatives
                    </span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

interface ChatGPTMessageGeneratingAnimationProps {
  mock?: Mock;
}
export const ChatGPTMessageGeneratingAnimation: FC<
  ChatGPTMessageGeneratingAnimationProps
> = ({ mock = new Mock() }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        transition={{ type: "spring", damping: 10 }}
        className={"w-full"}
      >
        <div
          className={
            "lottie-anim-demo w-full max-w-[900px] px-3 mx-auto flex flex-end " +
            (mock.is ? "h-auto" : "h-10")
          }
        >
          <Lottie animationData={typingAnimation} loop={true} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const ChatGPTMessageItem: FC<ChatGPTMessageItemProps> = (props) => {
  const {
    setMessages,
    isMock,
    messageItem: _messageItem,
    doneRef,
    chunksRef,
    isGenerating,
    disableCopy,
    size = 45,
    variantFontSize,
    conversationId,
  } = props;
  const [showCopyAnimation, setShowCopyAnimation] = useState(false);
  const [messageItem, setMessageItem] =
    useState<ChatGPTMessageObj>(_messageItem);
  const { state, dispatch } = useConversation();

  useEffect(() => {
    setMessageItem(_messageItem);
  }, [_messageItem]);

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
          {/*{messageItem.content}{messageItem.generating && <span className="w-1 inline-block -mb-1.5 h-5 bg-primary cursor-blink"/>}*/}
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

  if (isMock) {
    item = (
      <div className="flex items-start">
        {messageItem.content && (
          <p className="whitespace-pre-wrap text-[11px] text-primaryText opacity-60 flex-1">
            {/*{messageItem.content}{messageItem.generating && <span className="w-1 inline-block -mb-1.5 h-5 bg-primary cursor-blink"/>}*/}
            <MarkdownRenderer markdownContent={messageItem.content} />
          </p>
        )}
      </div>
    );
  }

  if (messageItem.generating && !(messageItem.adCreatives?.length > 0)) {
    item = (
      <GeneratingMessageItem
        isMock={isMock}
        setMessages={setMessages}
        messageItem={messageItem}
        chunksRef={chunksRef}
        doneRef={doneRef}
      />
    );
  }

  if (messageItem.type === "ad-json") {
    item = (
      <AdItem messageItem={messageItem} variantFontSize={variantFontSize} />
    );
  }

  if (messageItem.adCreatives?.length > 0) {
    item = (
      <AdItem messageItem={messageItem} variantFontSize={variantFontSize} />
    );
  }

  if (messageItem.content && (conversationId || isMock)) {
    const jsonObjectInString = getJSONObjectFromAString(messageItem.content);
    const isJson = isValidJsonWithAdsArray(jsonObjectInString);

    if (messageItem.adCreatives && messageItem.adCreatives.length > 0) {
      const msgItem = {
        ...messageItem,
        json: jsonObjectInString,
        content: null,
        adCreatives: messageItem.adCreatives,
      };
      setMessageItem(msgItem);
      // addAdCreatives(dispatch, adCreatives);
      item = <AdItem messageItem={msgItem} variantFontSize={variantFontSize} />;
    } else if (isJson) {
      const json = JSON.parse(jsonObjectInString) as AdJSONInput;
      const adCreatives: IAdCreative[] = [
        {
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          json: jsonObjectInString,
          variants: json.variants,
          disclaimer: json.disclaimer,
          summary: json.summary,
          companyName: json.companyName,
          adObjective: json.adObjective,
          conversationId: conversationId,
        },
      ];
      const msgItem = {
        ...messageItem,
        json: jsonObjectInString,
        content: null,
        adCreatives,
      };

      console.log("message Details | " + messageItem.id + " | ", msgItem);

      setMessageItem(msgItem);
      // addAdCreatives(dispatch, adCreatives);
      item = <AdItem messageItem={msgItem} variantFontSize={variantFontSize} />;
    }
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
              width={size}
              height={size}
              src={
                messageItem.role === ChatGPTRole.ASSISTANT
                  ? botData.image
                  : dummyUser.image
              }
              alt=""
            />
            <div
              className={`ml-[${isMock ? "3.5px" : "0.8em"}] flex-1 overflow-hidden`}
            >
              {item}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatGPTMessageItem;
