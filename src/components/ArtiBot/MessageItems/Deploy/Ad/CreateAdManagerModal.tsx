import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
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
import { useGetAdCreativeAutoComplete } from "@/api/conversation";

export default function CreateAdManagerModal() {
  const { formState, meta, setFormState } = useCampaignStore();

  // Fetching the AutoComplete
  const { data: autoCompleteFields, isFetching } = useGetAdCreativeAutoComplete(
    {
      adCreativeId: meta?.selectedVariant?.adCreativeId,
      enabled: formState.mode !== "edit" && formState.open === true,
    }
  );

  function handleClose() {
    setFormState({ open: false });
  }

  return (
    <Modal
      onClose={handleClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
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
            <div className="w-full flex items-center justify-between">
              <span>Create {AD_MANAGER_TABS[formState.tab]?.singular}</span>
              {isFetching && (
                <Spinner
                  classNames={{
                    base: "flex items-center justify-center",
                    label: "text-xs text-gray-500",
                  }}
                  size="sm"
                  label="Trying to prefill the fields"
                />
              )}
            </div>
          </ModalHeader>
          <ModalBody className="overflow-auto">
            {formState.tab === CampaignTab.CAMPAIGNS && (
              <CreateCampaign
                autoCompleteFields={autoCompleteFields?.campaign}
              />
            )}
            {formState.tab === CampaignTab.ADSETS && (
              <CreateAdset autoCompleteFields={autoCompleteFields?.ad_set} />
            )}
            {formState.tab === CampaignTab.ADS && (
              <CreateAd autoCompleteFields={autoCompleteFields?.ad} />
            )}
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
