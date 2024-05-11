import ConversationCard, {
  ConversationCardShimmer,
} from "@/components/Dashboard/ConversationCard";
import { useConversation } from "@/context/ConversationContext";
import { ChatGPTRole } from "@/interfaces/IArtiBot";
import { IConversation } from "@/interfaces/IConversation";
import { type } from "os";
import React, { useCallback, useMemo } from "react";
import style from "styled-jsx/style";

export default function useConversations() {
  const { state } = useConversation();

  //   function isActiveConversation(conversation: IConversation) {
  //     // We can check if the conversation is active or not
  //     // by checking the messages array and if the message has been received by the user
  //     return conversation.messages.some(
  //       (message) => message.role === ChatGPTRole.ASSISTANT
  //     );
  //   }

  //   const conversations = useMemo(() => {
  //     if (!state.conversation.list) return null;
  //     const _conversations = state.conversation.list;

  //     return _conversations
  //       .filter((c: IConversation) => isActiveConversation(c))
  //       .sort((a: IConversation, b: IConversation) => {
  //         if (a.updatedAt > b.updatedAt) return -1;
  //         if (a.updatedAt < b.updatedAt) return 1;
  //         return 0;
  //       });
  //   }, [state.conversation.list]);

  //   const isConversationLoading =
  //     state.loading.conversations &&
  //     conversations?.length === 0 &&
  //     (!state.conversation?.list || state.conversation?.list?.length === 0);

  const getConversationById = useCallback(
    (conversationId: string) => {
      return state.conversation.map[conversationId];
    },
    [state.conversation]
  );

  return {
    state,
    conversations: [],
    isConversationLoading: false,
    getConversationById,
  };
}
