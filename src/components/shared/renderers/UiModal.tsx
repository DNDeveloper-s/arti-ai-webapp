"use client";
import { Modal, ModalProps } from "@nextui-org/react";
import React from "react";

interface UiModalProps extends ModalProps {
  keepMounted?: boolean;
  children: React.ReactNode;
}

export default function UiModal(props: UiModalProps) {
  const { keepMounted, children, ...modalProps } = props;
  return (
    <Modal
      {...modalProps}
      portalContainer={
        window
          ? (window.document.getElementById("contextmenuportal") as HTMLElement)
          : undefined
      }
    >
      {(keepMounted ? true : open) && children}
    </Modal>
  );
}
