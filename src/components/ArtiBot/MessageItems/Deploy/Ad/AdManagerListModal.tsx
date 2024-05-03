import UiModal from "@/components/shared/renderers/UiModal";
import Link from "next/link";
import {
  Card,
  CardBody,
  ModalBody,
  ModalContent,
  ModalHeader,
  Progress,
  Spinner,
} from "@nextui-org/react";

import React from "react";
import useCampaignStore, { CampaignTab } from "@/store/campaign";
import CampaignView from "./components/Campaign/CampaignView";
import TabView from "./components/TabView";
import AdsetView from "./components/Adset/AdsetView";
import AdsView from "./components/Ads/AdsView";
import { useGetAdAccounts } from "@/api/user";
import SelectAdAccount from "./components/SelectAdAccount";
import { useGetAdCreativeAutoComplete } from "@/api/conversation";

interface DeployAdModalContentProps {}
function DeployAdModalContent(props: DeployAdModalContentProps) {
  const { selected, showProgress, meta } = useCampaignStore();
  const { data } = useGetAdCreativeAutoComplete({
    adCreativeId: meta.selectedVariant?.adCreativeId,
  });

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <Progress
            size="sm"
            isIndeterminate
            aria-label="Loading..."
            className="max-w-full"
            classNames={{
              indicator: showProgress ? "block" : "hidden",
            }}
          />
          <ModalHeader className="flex justify-between items-start pr-9 gap-1">
            <h2>Campaigns</h2>
            <SelectAdAccount />
          </ModalHeader>
          <ModalBody>
            <TabView />
            <div className="!p-4">
              {selected.tab === CampaignTab.CAMPAIGNS && <CampaignView />}
              {selected.tab === CampaignTab.ADSETS && <AdsetView />}
              {selected.tab === CampaignTab.ADS && <AdsView />}
            </div>
          </ModalBody>
        </>
      )}
    </ModalContent>
  );
}

interface SelectAdAccountModalContentProps {}
function SelectAdAccountModalContent(props: SelectAdAccountModalContentProps) {
  const { setSelectAdAccount } = useCampaignStore();
  const { data: adAccounts, isFetching } = useGetAdAccounts();

  const waiting = isFetching && !adAccounts;
  const noAdAccounts = !waiting && adAccounts && adAccounts.length === 0;
  const hasAdAccounts = !waiting && adAccounts && adAccounts.length > 0;

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <Progress
            size="sm"
            isIndeterminate
            aria-label="Loading..."
            className="max-w-full"
            classNames={{
              indicator: isFetching ? "block" : "hidden",
            }}
          />
          <ModalHeader className="flex flex-col gap-1">
            Select an Ad Account
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3 mb-4">
              {waiting && <Spinner label="Loading..." color="warning" />}
              {noAdAccounts && (
                <div className="flex flex-col gap-2 items-center px-3 my-4">
                  <p className="text-white text-center text-opacity-50 text-sm">
                    No Ad Accounts found
                  </p>
                  <p className="text-primary text-base">
                    <Link
                      target="_blank"
                      href="https://www.facebook.com/business/help/407323696966570?id=649869995454285"
                    >
                      Create an ad account.
                    </Link>
                  </p>
                </div>
              )}
              {hasAdAccounts &&
                adAccounts.map((adAccount) => (
                  <Card
                    key={adAccount.id}
                    classNames={{
                      body: "cursor-pointer",
                      base: "hover:bg-primary bg-default-100 transition-all",
                    }}
                  >
                    <CardBody
                      onClick={() => {
                        setSelectAdAccount(adAccount.id);
                      }}
                    >
                      <p>{adAccount.name}</p>
                    </CardBody>
                  </Card>
                ))}
            </div>
          </ModalBody>
        </>
      )}
    </ModalContent>
  );
}

interface AdManagerListModalProps {
  open: boolean;
  handleClose: () => void;
}
export default function AdManagerListModal(props: AdManagerListModalProps) {
  const { open, handleClose } = props;
  const { selectedAccountId } = useCampaignStore();

  return (
    <UiModal
      keepMounted={false}
      isOpen={open}
      onClose={handleClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      classNames={{
        wrapper: "bg-black bg-opacity-50",
        base: selectedAccountId
          ? "!max-w-[900px] !w-[90vw]"
          : "!max-w-[400px] !w-[90vw]",
      }}
    >
      {selectedAccountId ? (
        <DeployAdModalContent />
      ) : (
        <SelectAdAccountModalContent />
      )}
      {/* <ModalContent>
        <div>Deploy ad layout</div>
        {accessToken && (
          <DeployAdLayout variant={selectedVariant} accessToken={accessToken} />
        )}
      </ModalContent> */}
    </UiModal>
  );
}
