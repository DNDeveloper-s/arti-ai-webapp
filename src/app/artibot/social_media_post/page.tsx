"use client";

import React, { FC, useEffect } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AppLoader from "@/components/AppLoader";
import Conversation from "@/components/Conversation";
import { ConversationType } from "@/interfaces/IConversation";

interface PageProps {}

const Page: FC<PageProps> = (props) => {
  const { data, status } = useSession();

  if (status === "loading") return <AppLoader />;

  if (status === "unauthenticated") return redirect("/");

  return <Conversation type={ConversationType.SOCIAL_MEDIA_POST} />;
};

export default Page;
