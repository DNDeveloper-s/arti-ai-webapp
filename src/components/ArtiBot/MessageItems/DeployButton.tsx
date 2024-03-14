import { IAdVariant } from "@/interfaces/IArtiBot";
import { GrDeploy } from "react-icons/gr";
import { useSession } from "next-auth/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Snackbar from "@/components/Snackbar";
import { SnackbarContext } from "@/context/SnackbarContext";
import Modal from "@/components/Modal";
import DeployView from "./Deploy/DeployView";
import CreateSocialPostModal from "./Deploy/Post/CreateSocialPostModal";
import DeployAdModal from "./Deploy/Ad/DeployAdModal";

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

  return (
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
      <button
        onClick={() => {
          handleUserChoice(UserChoice.ad);
        }}
        className="cursor-pointer text-white hover:scale-105 fill-white text-sm flex justify-center gap-2 items-center bg-gray-800 border border-gray-500 rounded py-1.5 px-4 hover:bg-gray-700 transition-all"
      >
        <GrDeploy className="fill-white stroke-white [&>path]:stroke-white" />
        <span>Deploy Ad</span>
      </button>
      {/* <Modal
        PaperProps={{
          className:
            userChoice === UserChoice.ad
              ? "bg-black bg-opacity-90 p-6 w-[800px] h-[80vh]"
              : "bg-black bg-opacity-90 p-6",
        }}
        handleClose={() => setShowModal(false)}
        open={showModal}
      >
        <DeployView variant={variant} userChoice={userChoice} />
      </Modal> */}
      <DeployAdModal
        open={isOpen(UserChoice.ad)}
        handleClose={handleClose}
        selectedVariant={variant}
      />
      <CreateSocialPostModal
        open={isOpen(UserChoice.post)}
        handleClose={handleClose}
        selectedVariant={variant}
      />
      {/* <DeployView variant={variant} userChoice={userChoice} /> */}
      <Snackbar />
    </>
  );
}
