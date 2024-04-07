import { framerItem } from "@/config/framer-motion";
import { ChatGPTRole } from "@/interfaces/IArtiBot";
import { ConversationType } from "@/interfaces/IConversation";
import { AnimatePresence, motion } from "framer-motion";
import { welcomeMessage } from "../MessageItems/ChatGPTMessageItem";

interface MessageItemShimmerProps {
  content: string;
  role: ChatGPTRole;
}
function MessageItemShimmer({ content, role }: MessageItemShimmerProps) {
  let item = (
    <div className="flex items-start">
      <p className="whitespace-pre-wrap text-[1em] text-primaryText opacity-60 flex-1">
        <p className="app-shimmer rounded">{content}</p>
        {role === ChatGPTRole.ASSISTANT && (
          <p className="app-shimmer rounded mt-1">{content.slice(0, 150)}</p>
        )}
        <p className="app-shimmer rounded mt-1">{content.slice(0, 10)}</p>
      </p>
    </div>
  );
  return (
    <div
      // initial={{height: 0, opacity: 0}}
      // animate={{height: 'auto', opacity: 1}}
      // transition={{type: 'spring', damping: 15, duration: .15}}
      className={"w-full overflow-hidden"}
    >
      <div
        className={
          "group w-full " +
          (role === ChatGPTRole.ASSISTANT ? "" : "bg-background bg-opacity-30")
        }
      >
        <div className="flex items-start px-[1em] py-[0.9em] w-full max-w-[950px] mx-auto">
          <div className="w-[40px] h-[40px] app-shimmer rounded"></div>
          <div className={`ml-[0.8em] flex-1 overflow-hidden`}>{item}</div>
        </div>
      </div>
    </div>
  );
}

interface MessagesShimmerProps {
  conversationType: ConversationType;
}
export default function MessagesShimmer({
  conversationType,
}: MessagesShimmerProps) {
  return (
    <div>
      <MessageItemShimmer
        content={welcomeMessage[conversationType]}
        role={ChatGPTRole.ASSISTANT}
      />
      <MessageItemShimmer
        content="I am so good. What about you?"
        role={ChatGPTRole.USER}
      />
      <MessageItemShimmer
        content="I'm doing well, thank you! To better assist you in creating captivating ads, could you please share your name, role, the type of ad you're looking to create, and where you plan to display these ads?"
        role={ChatGPTRole.ASSISTANT}
      />
      <MessageItemShimmer
        content="[Confidence : 0%] Hello! I'm Arti, your AI assistant in crafting captivating advertisements. Could you please share your name, role, the type of ad you wish to create, and where you intend to display these ads?"
        role={ChatGPTRole.USER}
      />
      <MessageItemShimmer
        content="To better assist you, could you please specify the desired format of the ad creative (e.g., Facebook ad, Instagram post, billboard)? This way, I can provide you with a sample ad creative that aligns with your preferences."
        role={ChatGPTRole.USER}
      />
      <MessageItemShimmer
        content="I am so good. What about you?"
        role={ChatGPTRole.USER}
      />
      <MessageItemShimmer
        content="I'm doing well, thank you! To better assist you in creating captivating ads, could you please share your name, role, the type of ad you're looking to create, and where you plan to display these ads?"
        role={ChatGPTRole.ASSISTANT}
      />
      <MessageItemShimmer
        content="[Confidence : 0%] Hello! I'm Arti, your AI assistant in crafting captivating advertisements. Could you please share your name, role, the type of ad you wish to create, and where you intend to display these ads?"
        role={ChatGPTRole.USER}
      />
      <MessageItemShimmer
        content="To better assist you, could you please specify the desired format of the ad creative (e.g., Facebook ad, Instagram post, billboard)? This way, I can provide you with a sample ad creative that aligns with your preferences."
        role={ChatGPTRole.USER}
      />
    </div>
  );
}
