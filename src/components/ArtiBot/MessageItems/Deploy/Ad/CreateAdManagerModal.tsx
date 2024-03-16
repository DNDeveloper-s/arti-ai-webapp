import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import CreateAdset from "./components/Adset/Create/CreateAdset";
import useCampaignStore, {
  AD_MANAGER_TABS,
  CampaignTab,
} from "@/store/campaign";
import CreateCampaign from "./components/Campaign/Create/CreateCampaign";
import CreateAd from "./components/Ads/Create/CreateAd";

export default function CreateAdManagerModal() {
  const { createState, setCreateState } = useCampaignStore();

  function handleOpenChange(isOpen: boolean) {
    setCreateState({ ...createState, open: isOpen });
  }

  function handleClose() {
    setCreateState({ ...createState, open: false });
  }

  return (
    <Modal
      onOpenChange={handleOpenChange}
      onClose={() => setCreateState({ ...createState, open: false })}
      isDismissable={false}
      isOpen={createState.open}
      classNames={{
        base:
          createState.tab !== CampaignTab.CAMPAIGNS
            ? "!max-w-[900px] !max-h-[600px] !w-full"
            : "!max-w-[600px] !max-h-[600px] !w-full",
      }}
    >
      <ModalContent>
        <ModalHeader>
          Create {AD_MANAGER_TABS[createState.tab]?.singular}
        </ModalHeader>
        <ModalBody className="overflow-hidden">
          {createState.tab === CampaignTab.CAMPAIGNS && <CreateCampaign />}
          {createState.tab === CampaignTab.ADSETS && <CreateAdset />}
          {createState.tab === CampaignTab.ADS && <CreateAd />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
