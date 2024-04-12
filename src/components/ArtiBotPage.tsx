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
import { useBusiness } from "@/context/BusinessContext";

interface ArtiBotPageProps {
  projectName: string;
}

const ArtiBotPage: FC<ArtiBotPageProps> = ({ projectName }) => {
  const { state } = useConversation();
  const searchParams = useSearchParams();
  const { business } = useBusiness();
  const conversationType = searchParams.get("conversation_type");

  const isValidType = ValidConversationTypes.includes(
    conversationType as ConversationType
  );

  if (!business) return redirect("/", RedirectType.replace);

  if (!isValidType) return redirect("/artibot", RedirectType.replace);

  // Check if the conversation with no activity exists
  const id = ObjectId();

  // if (isStrategy) {
  return redirect(
    `/artibot/${conversationType}?conversation_id=${id}&project_name=${projectName}&business_id=${business.id}`,
    RedirectType.replace
  );
  // } else {
  // 	return redirect(`/artibot/${conversationType}/${id}?project_name=${projectName}`, 'replace');
  // }
};
export default ArtiBotPage;
