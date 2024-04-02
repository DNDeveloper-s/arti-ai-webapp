"use client";

import { dummy } from "@/constants/dummy";
import ConversationCard, {
  ConversationCardShimmer,
} from "@/components/Dashboard/ConversationCard";
import AdCreativeCard, {
  AdCreativeCardShimmer,
} from "@/components/Dashboard/AdCreativeCard";
import UploadItemCard from "@/components/Dashboard/UploadItemCard";
import webImage4 from "@/assets/images/image10.webp";
import webImage from "@/assets/images/image1.webp";
import AttachmentModal from "@/components/Dashboard/AttachmentModal";
import Drawer, { Position } from "@/components/Drawer";
import RightPane from "@/components/ArtiBot/RIghtPane/RightPane_Legacy";
import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { AttachmentDetails, ModalDispatchAction } from "@/interfaces";
import { IAdCreative } from "@/interfaces/IAdCreative";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import EmptyFolderIcon from "@/components/EmptyFolderIcon";
import Link from "next/link";
import {
  clearError,
  getAdCreatives,
  getConversations,
  useConversation,
} from "@/context/ConversationContext";
import { ConversationType, IConversation } from "@/interfaces/IConversation";
import { TabItem } from "@/components/shared/tabs/Tabs";
import AdCreativeIcon from "@/components/shared/icons/AdCreativeIcon";
import StrategyIcon from "@/components/shared/icons/StrategyIcon";
import useSessionToken from "@/hooks/useSessionToken";
import Snackbar from "@/components/Snackbar";
import { SnackbarContext } from "@/context/SnackbarContext";
import { ChatGPTRole } from "@/interfaces/IArtiBot";
import useAdCreatives from "@/hooks/useAdCreatives";
import useConversations from "@/hooks/useConversations";
import { useGetConversationInfinite } from "@/api/conversation";
import ConversationSection from "./ConversationSection";
import AdCreativeSection from "./AdCreativeSection";

enum EmptySectionType {
  CONVERSATION = "conversation",
  AD_CREATIVE = "ad_creative",
  UPLOAD = "upload",
}
interface EmptySectionProps {
  className?: string;
  type: EmptySectionType;
  style?: Record<string, string>;
}
const EmptySection: FC<EmptySectionProps> = (props) => {
  let items = null;
  let content = null;

  if (props.type === EmptySectionType.CONVERSATION) {
    items = dummy.DConversations.filter((c) => c.has_activity).map(
      (conversation) => (
        <ConversationCard
          key={conversation.title}
          conversation={conversation}
        />
      )
    );
    content = (
      <>
        <h3 className="text-lg text-primary text-opacity-70 font-bold">
          Looks like you don't have any Conversations
        </h3>
        <p className={"text-xs text-white text-opacity-40"}>
          Fortunately, it's easy to create new one.
        </p>
        <Link href="/artibot" className="text-primary underline">
          Start Chat
        </Link>
      </>
    );
  }

  if (props.type === EmptySectionType.AD_CREATIVE) {
    // items = dummy.DAd_Creatives.map(adCreative => <AdCreativeCard key={adCreative.json} adCreative={adCreative} onClick={() => {}} />)
    content = (
      <>
        <h3 className="text-lg text-primary text-opacity-70 font-bold">
          Looks like you don't have any Ad Creatives
        </h3>
        <p className={"text-xs text-white text-opacity-40"}>
          Get started by creating your first ad creative through a chat with our
          Arti AI Bot.
        </p>
      </>
    );
  }

  if (props.type === EmptySectionType.UPLOAD) {
    items = (
      <>
        <UploadItemCard
          fileDetails={{
            type: "pdf",
            url: "https://www.smcrealty.com/images/microsites/brochure/dlf-the-camellias-1619.pdf",
          }}
        />
        <UploadItemCard fileDetails={{ type: "image", url: webImage4 }} />
        <UploadItemCard fileDetails={{ type: "image", url: webImage }} />
        <UploadItemCard
          fileDetails={{
            type: "pdf",
            url: "https://www.smcrealty.com/images/microsites/brochure/dlf-the-camellias-1619.pdf",
          }}
        />
      </>
    );
    content = (
      <>
        <h3 className="text-lg text-primary text-opacity-70 font-bold">
          No uploads have been made yet.
        </h3>
        <p className={"text-xs text-white text-opacity-40"}>
          Start uploading to populate this section with your content.
        </p>
      </>
    );
  }

  return (
    <div className="relative w-full">
      <div
        style={{
          zIndex: 2000,
          backdropFilter: "blur(3px)",
          background: "rgba(0,0,0,0.6)",
          ...(props.style ?? {}),
        }}
        className="absolute w-full h-full flex flex-col gap-2 justify-center items-center backdrop-blur-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <EmptyFolderIcon width={100} height={100} />
        {content}
      </div>
      <div className="flex gap-4 w-full overflow-x-auto">{items}</div>
    </div>
  );
};

const tabItems = [
  { label: "Ad Creative", id: "ad_creative", icon: AdCreativeIcon },
  { label: "Strategy", id: "strategy", icon: StrategyIcon },
];

export default function CardSection() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] =
    useState<ModalDispatchAction<AttachmentDetails>>(null);
  const [currentAdCreative, setCurrentAdCreative] =
    useState<IAdCreative | null>(null);
  const { state, dispatch } = useConversation();
  const token = useSessionToken();
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;
  const [activeTabItem, setActiveTabItem] = useState<TabItem>(tabItems[0]);
  const { adVariantsByConversationId, sortedConversationIds } =
    useAdCreatives();
  const { conversations, isConversationLoading } = useConversations();
  const { data, ...props } = useGetConversationInfinite();

  useEffect(() => {
    if (state.error && state.error.message) {
      setSnackBarData({ status: "error", message: state.error.message });
      clearError(dispatch);
    }
  }, [dispatch, setSnackBarData, state.error]);

  useEffect(() => {
    token && dispatch && getConversations(dispatch);
  }, [dispatch, token]);

  useEffect(() => {
    token && dispatch && getAdCreatives(dispatch);
  }, [dispatch, token]);

  function handleAdCreativeClick(adCreativeItem: IAdCreative) {
    // setOpen(true);
    setCurrentAdCreative(adCreativeItem);
  }

  // TODO: Refactor them in corresponding component
  return (
    <>
      <ConversationSection />
      <AdCreativeSection />
      <AttachmentModal
        fileDetails={modalData}
        open={!!modalData}
        setOpen={setModalData}
      />
      <Snackbar />
    </>
  );
}
