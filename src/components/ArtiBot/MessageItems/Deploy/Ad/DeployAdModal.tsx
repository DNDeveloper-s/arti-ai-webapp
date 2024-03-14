import UiModal from "@/components/shared/renderers/UiModal";
import { IAdVariant } from "@/interfaces/IArtiBot";
import DeployAdLayout from "./DeployAdLayout";
import { Platform, useUser } from "@/context/UserContext";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  ModalBody,
  ModalContent,
  ModalHeader,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@nextui-org/react";
import { RiAdvertisementFill } from "react-icons/ri";
import { BsUiRadiosGrid } from "react-icons/bs";
import { HiMiniFolder } from "react-icons/hi2";
import UiTable from "@/components/shared/renderers/UiTable";
import { FaEllipsisVertical } from "react-icons/fa6";
import React, { Key, useState } from "react";
import { IoClose } from "react-icons/io5";
import useCampaignStore, { CampaignTab } from "@/store/campaign";
import CampaignView from "./components/Campaign/CampaignView";
import TabView from "./components/TabView";
import AdsetView from "./components/Adset/AdsetView";

interface DeployAdModalContentProps {}
function DeployAdModalContent(props: DeployAdModalContentProps) {
  const { selectedTab } = useCampaignStore();
  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Campaigns</ModalHeader>
          <ModalBody>
            <TabView />
            <div className="!p-4">
              {selectedTab === CampaignTab.CAMPAIGNS && <CampaignView />}
              {selectedTab === CampaignTab.ADSETS && <AdsetView />}
            </div>
          </ModalBody>
        </>
      )}
    </ModalContent>
  );
}

interface DeployAdModalProps {
  open: boolean;
  handleClose: () => void;
  selectedVariant: IAdVariant;
}
export default function DeployAdModal(props: DeployAdModalProps) {
  const { open, handleClose, selectedVariant } = props;

  return (
    <UiModal
      keepMounted={false}
      isOpen={open}
      onClose={handleClose}
      isDismissable={true}
      isKeyboardDismissDisabled={true}
      classNames={{
        wrapper: "bg-black bg-opacity-50",
        base: "!max-w-[900px] !w-full",
      }}
    >
      <DeployAdModalContent />
      {/* <ModalContent>
        <div>Deploy ad layout</div>
        {accessToken && (
          <DeployAdLayout variant={selectedVariant} accessToken={accessToken} />
        )}
      </ModalContent> */}
    </UiModal>
  );
}
