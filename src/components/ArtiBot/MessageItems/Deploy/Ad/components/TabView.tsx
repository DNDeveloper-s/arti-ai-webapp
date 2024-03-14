import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useEditVariant } from "@/context/EditVariantContext";
import { Chip, Tab, Tabs } from "@nextui-org/react";
import { HiMiniFolder } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { BsUiRadiosGrid } from "react-icons/bs";
import useCampaignStore from "@/store/campaign";
import { RiAdvertisementFill } from "react-icons/ri";

interface TabViewProps {}
const TabView: FC<TabViewProps> = ({}) => {
  const {
    selectedCampaigns,
    setSelectedCampaigns,
    selectedAdSets,
    setSelectedAdSets,
    selectedTab,
    setSelectedTab,
  } = useCampaignStore();

  return (
    <Tabs
      fullWidth
      aria-label="Options"
      color="primary"
      size="md"
      variant="underlined"
      classNames={{
        tabContent: "!w-[95%]",
        cursor: "!w-[95%]",
        tab: "!h-[45px]",
      }}
      selectedKey={selectedTab}
      onSelectionChange={setSelectedTab}
    >
      <Tab
        key="campaigns"
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HiMiniFolder />
              <span>Campaigns</span>
            </div>
            {((selectedCampaigns instanceof Set &&
              selectedCampaigns.size > 0) ||
              selectedCampaigns === "all") && (
              <Chip color="default" size="sm">
                <div className="flex gap-1 items-center text-white">
                  <span>
                    {selectedCampaigns === "all"
                      ? "All"
                      : selectedCampaigns.size}{" "}
                    selected
                  </span>
                  <div
                    className="block hover:bg-gray-700 text-medium bg-opacity-20"
                    onClick={() => setSelectedCampaigns(new Set([]))}
                  >
                    <IoClose />
                  </div>
                </div>
              </Chip>
            )}
          </div>
        }
      />
      <Tab
        key="ad-sets"
        title={
          <div className="flex items-center space-x-2">
            <BsUiRadiosGrid />
            <span>Ad Sets</span>
          </div>
        }
      />
      <Tab
        key="ads"
        title={
          <div className="flex items-center space-x-2">
            <RiAdvertisementFill />
            <span>Ads</span>
          </div>
        }
      />
    </Tabs>
  );
};

export default TabView;
