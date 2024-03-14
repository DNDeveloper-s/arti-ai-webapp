import { IAdCampaign } from "@/interfaces/ISocial";
import { Selection } from "@nextui-org/react";
import { Key } from "react";
import { create } from "zustand";

export enum CampaignTab {
  CAMPAIGNS = "campaigns",
  ADSETS = "adsets",
  ADS = "ads",
}

type CampaignState = {
  campaigns: IAdCampaign[];
  selectedCampaigns: Selection;
  selectedTab: CampaignTab;
  selectedAdSets: Selection;
};

type CampaignActions = {
  setCampaigns: (campaigns: IAdCampaign[]) => void;
  setSelectedCampaigns: (selectedKeys: Selection) => any;
  setSelectedAdSets: (selectedKeys: Selection) => any;
  setSelectedTab: (selectedTab: Key) => any;
};

const initialCampaignState: CampaignState = {
  campaigns: [],
  selectedCampaigns: new Set([]),
  selectedAdSets: new Set([]),
  selectedTab: CampaignTab.CAMPAIGNS,
};

const useCampaignStore = create<CampaignState & CampaignActions>((set) => ({
  ...initialCampaignState,
  setCampaigns: (campaigns: IAdCampaign[]) => set({ campaigns }),
  setSelectedCampaigns: (selectedCampaigns: Selection) =>
    set({ selectedCampaigns }),
  setSelectedAdSets: (selectedAdSets: Selection) => set({ selectedAdSets }),
  setSelectedTab: (selectedTab: Key) =>
    set({ selectedTab: selectedTab as CampaignTab }),
  reset: () => {
    set(initialCampaignState);
  },
}));
export default useCampaignStore;
