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
  FormState,
} from "@/store/campaign";
import CreateCampaign from "./components/Campaign/Create/CreateCampaign";
import CreateAd from "./components/Ads/Create/CreateAd";

export default function CreateAdManagerModal() {
  const { formState, setFormState } = useCampaignStore();

  function handleClose() {
    setFormState({ open: false });
  }

  return (
    <Modal
      onClose={handleClose}
      isDismissable={false}
      isOpen={formState.open}
      portalContainer={
        document.getElementById("contextmenuportal") as HTMLElement
      }
      classNames={{
        base:
          formState.tab !== CampaignTab.CAMPAIGNS
            ? "!max-w-[900px] !max-h-[70vh] !w-full"
            : "!max-w-[600px] !max-h-[90vh] !w-full",
      }}
    >
      {formState.open && (
        <ModalContent>
          <ModalHeader>
            Create {AD_MANAGER_TABS[formState.tab]?.singular}
          </ModalHeader>
          <ModalBody className="overflow-auto">
            {formState.tab === CampaignTab.CAMPAIGNS && <CreateCampaign />}
            {formState.tab === CampaignTab.ADSETS && <CreateAdset />}
            {formState.tab === CampaignTab.ADS && <CreateAd />}
          </ModalBody>
        </ModalContent>
      )}
    </Modal>
  );
}

export const getSubmitText = (
  formState: FormState,
  isPending?: boolean,
  suffix?: string
) => {
  const mode = formState.mode;
  const pre = mode === "create" ? "Cre" : "Upd";
  const suf = suffix ? ` ${suffix}` : "";
  return `${pre}${isPending ? "ating..." : "ate " + suffix}`;
};
