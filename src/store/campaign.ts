import { IAdVariant } from "@/interfaces/IArtiBot";
import { IAdCampaign } from "@/interfaces/ISocial";
import { Selection } from "@nextui-org/react";
import { Key } from "react";
import { create } from "zustand";

export enum CampaignTab {
  CAMPAIGNS = "campaigns",
  ADSETS = "adsets",
  ADS = "ads",
}

export const AD_MANAGER_TABS = {
  [CampaignTab.CAMPAIGNS]: {
    singular: "Campaign",
    plural: "Campaigns",
    key: "campaigns",
  },
  [CampaignTab.ADSETS]: {
    singular: "Adset",
    plural: "Adsets",
    key: "adsets",
  },
  [CampaignTab.ADS]: {
    singular: "Ad",
    plural: "Ads",
    key: "ads",
  },
};

export interface SelectedMap extends Record<CampaignTab, Selection> {
  tab: CampaignTab;
}

export type CreateStateValue = "campaign" | "adset" | "ad";

export type CreateState = {
  open: boolean;
  tab: CampaignTab;
};

type CampaignStateMeta = {
  selectedVariant?: IAdVariant;
};

type CampaignState = {
  campaigns: IAdCampaign[];
  selected: SelectedMap;
  createState: CreateState;
  meta: CampaignStateMeta;
};

type CampaignActions = {
  viewAdsetsByCampaign: (campaignId: string) => any;
  viewAdsByAdset: (adSetId: string) => any;
  setSelected: (key: keyof SelectedMap) => (value: any) => any;
  setCreateState: (value: CreateState) => any;
  setMeta: (
    key: keyof CampaignStateMeta,
    value: CampaignStateMeta[keyof CampaignStateMeta]
  ) => any;
};

const initialCampaignState: CampaignState = {
  campaigns: [],
  selected: {
    tab: CampaignTab.CAMPAIGNS,
    [CampaignTab.CAMPAIGNS]: new Set([]),
    [CampaignTab.ADSETS]: new Set([]),
    [CampaignTab.ADS]: new Set([]),
  },
  createState: {
    open: false,
    tab: CampaignTab.CAMPAIGNS,
  },
  meta: {},
};

const useCampaignStore = create<CampaignState & CampaignActions>((set) => ({
  ...initialCampaignState,
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
  setCreateState: (value: CreateState) => set({ createState: value }),
  setSelected: (key: keyof SelectedMap) => (value: any) => {
    set((state) => ({
      ...state,
      selected: {
        ...state.selected,
        [key]: value,
      },
    }));
  },
  setMeta: (
    key: keyof CampaignStateMeta,
    value: CampaignStateMeta[keyof CampaignStateMeta]
  ) => {
    set((state) => ({
      ...state,
      [key]: value,
    }));
  },
  reset: () => {
    set(initialCampaignState);
  },
}));
export default useCampaignStore;
