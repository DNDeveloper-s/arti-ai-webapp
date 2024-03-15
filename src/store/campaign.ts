import { IAdCampaign } from "@/interfaces/ISocial";
import { Selection } from "@nextui-org/react";
import { Key } from "react";
import { create } from "zustand";

export enum CampaignTab {
  CAMPAIGNS = "campaigns",
  ADSETS = "adsets",
  ADS = "ads",
}

export interface SelectedMap extends Record<CampaignTab, Selection> {
  tab: CampaignTab;
}

type CampaignState = {
  campaigns: IAdCampaign[];
  /**@deprecated */
  selectedCampaigns: Selection;
  /**@deprecated */
  selectedTab: CampaignTab;
  /**@deprecated */
  selectedAdSets: Selection;
  /**@deprecated */
  selectedAds: Selection;
  selected: SelectedMap;
};

type CampaignActions = {
  /**@deprecated */
  setCampaigns: (campaigns: IAdCampaign[]) => void;
  /**@deprecated */
  setSelectedCampaigns: (selectedCampaigns: Selection) => any;
  /**@deprecated */
  setSelectedAdSets: (selectedAdSets: Selection) => any;
  /**@deprecated */
  setSelectedAds: (selectedAds: Selection) => any;
  /**@deprecated */
  setSelectedTab: (selectedTab: Key) => any;
  viewAdsetsByCampaign: (campaignId: string) => any;
  viewAdsByAdset: (adSetId: string) => any;
  setSelected: (key: keyof SelectedMap) => (value: any) => any;
};

const initialCampaignState: CampaignState = {
  campaigns: [],
  selectedCampaigns: new Set([]),
  selectedAdSets: new Set([]),
  selectedAds: new Set([]),
  selectedTab: CampaignTab.CAMPAIGNS,
  selected: {
    tab: CampaignTab.CAMPAIGNS,
    [CampaignTab.CAMPAIGNS]: new Set([]),
    [CampaignTab.ADSETS]: new Set([]),
    [CampaignTab.ADS]: new Set([]),
  },
};

const useCampaignStore = create<CampaignState & CampaignActions>((set) => ({
  ...initialCampaignState,
  setCampaigns: (campaigns: IAdCampaign[]) => set({ campaigns }),
  setSelectedCampaigns: (selectedCampaigns: Selection) =>
    set({ selectedCampaigns }),
  setSelectedAdSets: (selectedAdSets: Selection) => set({ selectedAdSets }),
  setSelectedAds: (selectedAds: Selection) => set({ selectedAds }),
  setSelectedTab: (selectedTab: Key) =>
    set({ selectedTab: selectedTab as CampaignTab }),
  viewAdsetsByCampaign: (campaignId: string) => {
    set((state) => ({
      ...state,
      selected: {
        ...state.selected,
        tab: CampaignTab.ADSETS,
        [CampaignTab.CAMPAIGNS]: new Set([campaignId]),
        [CampaignTab.ADS]: new Set([]),
        [CampaignTab.ADSETS]: new Set([]),
      },
    }));
  },
  viewAdsByAdset: (adSetId: string) => {
    set((state) => ({
      ...state,
      selected: {
        ...state.selected,
        tab: CampaignTab.ADS,
        [CampaignTab.ADSETS]: new Set([adSetId]),
        [CampaignTab.ADS]: new Set([]),
      },
    }));
  },
  setSelected: (key: keyof SelectedMap) => (value: any) => {
    set((state) => ({
      ...state,
      selected: {
        ...state.selected,
        [key]: value,
      },
    }));
  },
  reset: () => {
    set(initialCampaignState);
  },
}));
export default useCampaignStore;
