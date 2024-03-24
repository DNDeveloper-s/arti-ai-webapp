"use client";

import React, { FC } from "react";
import ObjectId from "bson-objectid";
import { dummy } from "@/constants/dummy";
import {
  RedirectType,
  redirect,
  useParams,
  useSearchParams,
} from "next/navigation";
import { useConversation } from "@/context/ConversationContext";
import {
  ConversationType,
  ValidConversationTypes,
} from "@/interfaces/IConversation";

interface ArtiBotPageProps {
  projectName: string;
}

const ArtiBotPage: FC<ArtiBotPageProps> = ({ projectName }) => {
  const { state } = useConversation();
  const searchParams = useSearchParams();
  const conversationType = searchParams.get("conversation_type");

  const isValidType = ValidConversationTypes.includes(
    conversationType as ConversationType
  );

  if (!isValidType) return redirect("/artibot", RedirectType.replace);

  // Check if the conversation with no activity exists
  const id = ObjectId();

  // if (isStrategy) {
  return redirect(
    `/artibot/${conversationType}?conversation_id=${id}&project_name=${projectName}`,
    RedirectType.replace
  );
  // } else {
  // 	return redirect(`/artibot/${conversationType}/${id}?project_name=${projectName}`, 'replace');
  // }
};
export default ArtiBotPage;
