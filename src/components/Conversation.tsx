"use client";

import ArtiBot from "@/components/ArtiBot/ArtiBot";
import { dummy } from "@/constants/dummy";
import React, { useEffect } from "react";
import { redirect, useParams, useSearchParams } from "next/navigation";
import { ConversationType, IConversation } from "@/interfaces/IConversation";
import {
  createConversation,
  getConversation,
  useConversation,
} from "@/context/ConversationContext";
import useSessionToken from "@/hooks/useSessionToken";
import ArtiBotPage from "./ArtiBot/ConversationPage";
import { useGetUserProviders } from "@/api/user";
import { useUser } from "@/context/UserContext";

// Fetch the conversation from the database
// If the conversation doesn't exist, create a new conversation
// If the conversation exists, use that conversation

// Update the conversation at the following events:
// 1. When the user sends a message
// 2. When the user receives a message
// 3. When the user opens the conversation
// 4. When the user closes the conversation

// Update the ad creative at the following events:
// 1. When the ad creative is generated
// 2. When the user likes the ad creative
// 3. When the user dislikes the ad creative
// 4. When the user comments on the ad creative

export default function Conversation({
  type = ConversationType.AD_CREATIVE,
}: {
  type: ConversationType;
}) {
  let conversation: IConversation | undefined;
  const { state, dispatch } = useConversation();
  // const params = useParams();
  const searchParams = useSearchParams();
  const token = useSessionToken();
  const conversationId = searchParams.get("conversation_id");
  const { data: accounts } = useGetUserProviders();
  const { setAccounts } = useUser();

  useEffect(() => {
    if (accounts) {
      setAccounts(accounts);
    }
  }, [setAccounts, accounts]);

  useEffect(() => {
    if (conversationId && token)
      getConversation(dispatch, conversationId.toString());
  }, [dispatch, token, conversationId]);

  useEffect(() => {
    if (state.loading.conversation || !dispatch || !conversationId) return;

    if (!state.conversation.map || !state.conversation.map[conversationId]) {
      const projectName = searchParams.get("project_name");
      if (!projectName) return redirect("/artibot");
      const newConversation: IConversation = {
        id: Array.isArray(conversationId) ? conversationId[0] : conversationId,
        messages: [],
        last_activity: new Date().toISOString(),
        title: "New Chat",
        conversation_type: type,
        // Check if the conversation has any activity
        has_activity: false,
        project_name: projectName ? projectName : "",
      };
      createConversation(dispatch, newConversation);
    }
  }, [
    dispatch,
    state.loading.conversation,
    state.conversation.map,
    conversationId,
    state.conversation,
    type,
    searchParams,
  ]);

  useEffect(() => {
    console.log("mounted | Conversation - ");
  }, []);

  return (
    <main>
      {/*<Logo />*/}
      <div className="grid grid-cols-[1fr] h-screen">
        {/*<div className="bg-background">*/}

        {/*</div>*/}
        <ArtiBotPage
          conversation={state.conversation.map[conversationId.toString()]}
        />
      </div>
    </main>
  );
}
