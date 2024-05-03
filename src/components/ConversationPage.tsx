"use client";

import { RedirectType, redirect, useSearchParams } from "next/navigation";
import Conversation from "./Conversation";
import {
  ConversationType,
  ValidConversationTypes,
} from "@/interfaces/IConversation";
import { useBusiness } from "@/context/BusinessContext";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ErrorMasterComponent } from "./shared/error/ErrorComponent";

export default function ConversationPage() {
  const searchParams = useSearchParams();
  const { business } = useBusiness();
  const conversationType = searchParams.get("conversation_type");

  const isValidType = ValidConversationTypes.includes(
    conversationType as ConversationType
  );

  if (conversationType && !isValidType) {
    return redirect("/artibot/create", RedirectType.replace);
  }

  return (
    <ErrorBoundary errorComponent={ErrorMasterComponent}>
      <Conversation
        type={(conversationType as ConversationType) ?? undefined}
      />
    </ErrorBoundary>
  );
}
