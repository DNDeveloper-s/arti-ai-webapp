import { IAdVariant } from "@/interfaces/IArtiBot";
import { GrDeploy } from "react-icons/gr";
import { useSession } from "next-auth/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Snackbar from "@/components/Snackbar";
import { SnackbarContext } from "@/context/SnackbarContext";
import Modal from "@/components/Modal";
import DeployView from "./Deploy/DeployView";
import CreateSocialPostModal from "./Deploy/Post/CreateSocialPostModal";
import { useUser } from "@/context/UserContext";
import ConnectProviderModal from "./Deploy/ConnectProviderModal";
import AdManagerListModal from "./Deploy/Ad/AdManagerListModal";
import CreateAdManagerModal from "./Deploy/Ad/CreateAdManagerModal";
import useConversations from "@/hooks/useConversations";
import { useSearchParams } from "next/navigation";
import { ConversationType } from "@/interfaces/IConversation";

export enum UserChoice {
  post,
  ad,
}

export default function DeployButton({ variant }: { variant: IAdVariant }) {
  const { data: session, status } = useSession();
  const [snackBarData, setSnackBarData] =
    useContext(SnackbarContext).snackBarData;
  const [showModal, setShowModal] = useState(false);
  const [userChoice, setUserChoice] = useState<UserChoice | null>(null);
  const { state } = useUser();
  const { getConversationById } = useConversations();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversation_id");

  const handleUserChoice = async (choice: UserChoice) => {
    if (!session || !session.user) {
      setSnackBarData({ message: "Please Login again!", status: "error" });
      return;
    }

    setUserChoice(choice);
    setShowModal(true);
  };

  const isOpen = useCallback(
    (choice: UserChoice) => {
      return userChoice === choice;
    },
    [userChoice]
  );

  const handleClose = () => {
    setUserChoice(null);
  };

  const hasNoAccount =
    (state.data?.accounts ?? []).filter((c) => c.provider === "facebook")
      .length === 0;

  const currentConversation = useMemo(() => {
    if (!conversationId) return null;
    return getConversationById(conversationId);
  }, [conversationId, getConversationById]);

  if (!currentConversation) return null;

  if (hasNoAccount) {
    return <ConnectProviderModal />;
  }

  return (
    <>
      {currentConversation.conversation_type ===
        ConversationType.SOCIAL_MEDIA_POST && (
        <>
          <button
            onClick={() => {
              handleUserChoice(UserChoice.post);
            }}
            className="cursor-pointer text-white hover:scale-105 fill-white text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all"
          >
            <GrDeploy className="fill-white stroke-white [&>path]:stroke-white" />
            <span>Deploy Post</span>
          </button>
          <CreateSocialPostModal
            open={isOpen(UserChoice.post)}
            handleClose={handleClose}
            selectedVariant={variant}
          />
        </>
      )}
      {currentConversation.conversation_type ===
        ConversationType.AD_CREATIVE && (
        <>
          <button
            onClick={() => {
              handleUserChoice(UserChoice.ad);
            }}
            className="cursor-pointer text-white hover:scale-105 fill-white text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all"
          >
            <GrDeploy className="fill-white stroke-white [&>path]:stroke-white" />
            <span>Deploy Ad</span>
          </button>
          <AdManagerListModal
            open={isOpen(UserChoice.ad)}
            handleClose={handleClose}
            selectedVariant={variant}
          />
        </>
      )}
      <Snackbar />
    </>
  );
}
