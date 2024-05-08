import { ChatGPTRole } from "@/interfaces/IArtiBot";
import { ConversationType } from "@/interfaces/IConversation";
import { welcomeMessage } from "../MessageItems/ChatGPTMessageItem";
import { random } from "lodash";
import { useMemo } from "react";

interface MessageItemShimmerProps {
  content: string;
  role: ChatGPTRole;
}

function MessageItemShimmer({ content, role }: MessageItemShimmerProps) {
  const items = useMemo(() => {
    return Array.from(Array(random(3, 10))).map((_, i) => (
      <span key={i} className="app-shimmer h-[20px] rounded">
        {content.slice(0, random(10, 50))}
      </span>
    ));
  }, [content]);
  let item = (
    <div className="flex items-start">
      <p className="flex item-start gap-2 flex-wrap whitespace-pre-wrap text-[1em] text-primaryText opacity-60 flex-1">
        {items}
      </p>
    </div>
  );
  return (
    <div className={"w-full overflow-hidden"}>
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

const messageContent =
  "To better assist you, could you please specify the desired format of the ad creative (e.g., Facebook ad, Instagram post, billboard)? This way, I can provide you with a sample ad creative that aligns with your preferences To better assist you, could you please specify the desired format of the ad creative (e.g., Facebook ad, Instagram post, billboard)? This way, I can provide you with a sample ad creative that aligns with your preferences To better assist you, could you please specify the desired format of the ad creative (e.g., Facebook ad, Instagram post, billboard)? This way, I can provide you with a sample ad creative that aligns with your preferences";

interface MessagesShimmerProps {
  conversationType: ConversationType;
}
export default function MessagesShimmer({
  conversationType,
}: MessagesShimmerProps) {
  return (
    <div
      className="animate-pulse"
      data-testid={"conversation-messages-shimmer"}
    >
      <MessageItemShimmer
        content={welcomeMessage[conversationType]}
        role={ChatGPTRole.ASSISTANT}
      />
      <MessageItemShimmer content={messageContent} role={ChatGPTRole.USER} />
      <MessageItemShimmer
        content={messageContent}
        role={ChatGPTRole.ASSISTANT}
      />
      <MessageItemShimmer content={messageContent} role={ChatGPTRole.USER} />
      <MessageItemShimmer content={messageContent} role={ChatGPTRole.USER} />
      <MessageItemShimmer content={messageContent} role={ChatGPTRole.USER} />
      <MessageItemShimmer
        content={messageContent}
        role={ChatGPTRole.ASSISTANT}
      />
      <MessageItemShimmer content={messageContent} role={ChatGPTRole.USER} />
      <MessageItemShimmer content={messageContent} role={ChatGPTRole.USER} />
      <MessageItemShimmer
        content={welcomeMessage[conversationType]}
        role={ChatGPTRole.ASSISTANT}
      />
      <MessageItemShimmer content={messageContent} role={ChatGPTRole.USER} />
      <MessageItemShimmer
        content={messageContent}
        role={ChatGPTRole.ASSISTANT}
      />
      <MessageItemShimmer content={messageContent} role={ChatGPTRole.USER} />
      <MessageItemShimmer content={messageContent} role={ChatGPTRole.USER} />
      <MessageItemShimmer content={messageContent} role={ChatGPTRole.USER} />
      <MessageItemShimmer
        content={messageContent}
        role={ChatGPTRole.ASSISTANT}
      />
      <MessageItemShimmer content={messageContent} role={ChatGPTRole.USER} />
      <MessageItemShimmer content={messageContent} role={ChatGPTRole.USER} />
    </div>
  );
}
