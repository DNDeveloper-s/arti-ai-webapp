import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useEditVariant } from "@/context/EditVariantContext";
import { Chip, Selection, Tab, Tabs } from "@nextui-org/react";
import { HiMiniFolder } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { BsUiRadiosGrid } from "react-icons/bs";
import useCampaignStore, { CampaignTab } from "@/store/campaign";
import { RiAdvertisementFill } from "react-icons/ri";

const TabChip = ({
  selectedItems,
  setSelectedItems,
}: {
  selectedItems: Selection;
  setSelectedItems: (value: Selection) => any;
}) => {
  return (selectedItems instanceof Set && selectedItems.size > 0) ||
    selectedItems === "all" ? (
    <Chip color="default" size="sm">
      <div className="flex gap-1 items-center text-white">
        <span>
          {selectedItems === "all" ? "All" : selectedItems.size} selected
        </span>
        <div
          className="block hover:bg-gray-700 text-medium bg-opacity-20"
          onClick={() => setSelectedItems(new Set([]))}
        >
          <IoClose />
        </div>
      </div>
    </Chip>
  ) : null;
};

interface TabViewProps {}
const TabView: FC<TabViewProps> = ({}) => {
  const { selected, setSelected } = useCampaignStore();

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
      selectedKey={selected.tab}
      onSelectionChange={setSelected("tab")}
    >
      <Tab
        key={CampaignTab.CAMPAIGNS}
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HiMiniFolder />
              <span>Campaigns</span>
            </div>
            <TabChip
              selectedItems={selected.campaigns}
              setSelectedItems={setSelected(CampaignTab.CAMPAIGNS)}
            />
          </div>
        }
      />
      <Tab
        key={CampaignTab.ADSETS}
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BsUiRadiosGrid />
              <span>Ad Sets</span>
            </div>
            <TabChip
              selectedItems={selected.adsets}
              setSelectedItems={setSelected(CampaignTab.ADSETS)}
            />
          </div>
        }
      />
      <Tab
        key={CampaignTab.ADS}
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RiAdvertisementFill />
              <span>Ads</span>
            </div>
            <TabChip
              selectedItems={selected.ads}
              setSelectedItems={setSelected(CampaignTab.ADS)}
            />
          </div>
        }
      />
    </Tabs>
  );
};

export default TabView;
