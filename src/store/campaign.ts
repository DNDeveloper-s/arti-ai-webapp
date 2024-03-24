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

export type FormStateMode = "create" | "edit";

type CampaignStateMeta = {
  selectedVariant?: IAdVariant;
};

type CampaignState = {
  campaigns: IAdCampaign[];
  selected: SelectedMap;
  formState: FormState;
  meta: CampaignStateMeta;
  showProgress: boolean;
  selectedAccountId?: string;
};

interface FormStateOpenParamsWithEdit {
  open: true;
  tab: CampaignTab;
  mode: "edit";
  rawData: { id: string } & Record<string, any>;
}

interface FormStateOpenParamsWithOutEdit {
  open: true;
  tab: CampaignTab;
  mode: "create";
}

interface FormStateCloseParams {
  open: false;
  tab?: CampaignTab;
  mode?: FormStateMode;
}

export type FormState =
  | FormStateOpenParamsWithEdit
  | FormStateOpenParamsWithOutEdit
  | FormStateCloseParams;

type CampaignActions = {
  viewAdsetsByCampaign: (campaignId: string) => any;
  viewAdsByAdset: (adsetId: string) => any;
  setSelected: (key: keyof SelectedMap) => (value: any) => any;
  setFormState: (value: FormState) => any;
  setMeta: (
    key: keyof CampaignStateMeta,
    value: CampaignStateMeta[keyof CampaignStateMeta]
  ) => any;
  setShowProgress: (value: boolean) => any;
  setSelectAdAccount: (accountId: string) => any;
};

const initialCampaignState: CampaignState = {
  campaigns: [],
  selected: {
    tab: CampaignTab.CAMPAIGNS,
    [CampaignTab.CAMPAIGNS]: new Set([]),
    [CampaignTab.ADSETS]: new Set([]),
    [CampaignTab.ADS]: new Set([]),
  },
  formState: {
    open: false,
    tab: CampaignTab.CAMPAIGNS,
    mode: "create",
  },
  meta: {},
  showProgress: false,
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
  setSelectAdAccount: (accountId: string) => {
    set({ selectedAccountId: accountId });
  },
  viewAdsByAdset: (adsetId: string) => {
    set((state) => ({
      ...state,
      selected: {
        ...state.selected,
        tab: CampaignTab.ADS,
        [CampaignTab.ADSETS]: new Set([adsetId]),
        [CampaignTab.ADS]: new Set([]),
      },
    }));
  },
  setShowProgress: (value: boolean) => {
    set({ showProgress: value });
  },
  setFormState: (value: FormState) =>
    set((state) => ({
      ...state,
      formState: { ...state.formState, ...value },
    })),
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
