import UiModal from "@/components/shared/renderers/UiModal";
import { IAdVariant } from "@/interfaces/IArtiBot";
import DeployAdLayout from "./DeployAdLayout";
import { Platform, useUser } from "@/context/UserContext";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  ModalBody,
  ModalContent,
  ModalHeader,
  Progress,
  Spinner,
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
import React, { Key, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import useCampaignStore, { CampaignTab } from "@/store/campaign";
import CampaignView from "./components/Campaign/CampaignView";
import TabView from "./components/TabView";
import AdsetView from "./components/Adset/AdsetView";
import AdsView from "./components/Ads/AdsView";
import { useGetAdAccounts } from "@/api/user";
import SelectAdAccount from "./components/SelectAdAccount";

interface DeployAdModalContentProps {}
function DeployAdModalContent(props: DeployAdModalContentProps) {
  const { selected, showProgress } = useCampaignStore();
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
              {isFetching && <Spinner label="Loading..." color="warning" />}
              {adAccounts &&
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
  selectedVariant: IAdVariant;
}
export default function AdManagerListModal(props: AdManagerListModalProps) {
  const { open, handleClose, selectedVariant } = props;
  const { setMeta, selectedAccountId } = useCampaignStore();

  useEffect(() => {
    setMeta("selectedVariant", selectedVariant);
  }, [selectedVariant, setMeta]);

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
