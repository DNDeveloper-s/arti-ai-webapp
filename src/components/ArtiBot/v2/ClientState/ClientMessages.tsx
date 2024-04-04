import { useClientMessages } from "@/context/ClientMessageContext";
import MessageItem from "../MessageItem";
import { useEffect, useMemo } from "react";
import { message } from "antd";
import {
  ChatGPTMessageCreatingAd,
  ChatGPTMessageGeneratingAnimation,
} from "../../MessageItems/ChatGPTMessageItem";
import { useCurrentConversation } from "@/context/CurrentConversationContext";

export default function ClientMessages() {
  const { messageRecord, isPending, isGeneratingJson } = useClientMessages();
  const { conversation } = useCurrentConversation();

  const messages = useMemo(() => {
    return messageRecord.getByConversationId(conversation?.id);
  }, [messageRecord, conversation?.id]);

  // console.log("messages - ", messages);

  return (
    <>
      {messages.map((messageItem) => (
        <MessageItem key={messageItem.id} isClient messageItem={messageItem} />
      ))}
      {isPending && <ChatGPTMessageGeneratingAnimation />}
      {isGeneratingJson && <ChatGPTMessageCreatingAd hideProfilePic={true} />}
    </>
  );
}
