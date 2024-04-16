"use client";

import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  IBusinessResponse,
  SocialPageType,
  useGetConversation,
  useQueryUserBusiness,
} from "@/api/conversation";
import { IConversation } from "@/interfaces/IConversation";
import useCampaignStore from "@/store/campaign";

type IBusinessState = IBusinessResponse | undefined | null;

export const initBusinessState: IBusinessState = undefined;

enum BUSINESS_ACTION_TYPE {
  SET = "SET",
}

interface BusinessAction {
  type: BUSINESS_ACTION_TYPE;
  payload: Partial<IBusinessState>;
}

function BusinessReducer(
  state: IBusinessState,
  action: BusinessAction
): IBusinessState {
  const { type, payload } = action;
  switch (type) {
    case BUSINESS_ACTION_TYPE.SET:
      return state;
    default:
      return state;
  }
}

const useBusinessContext = (initState: IBusinessState) => {
  const [state, dispatch] = useReducer(BusinessReducer, initState);
  const [business, setBusiness] = useState<IBusinessState>(null);
  const { data } = useQueryUserBusiness();
  const { setSelectAdAccount } = useCampaignStore();

  useEffect(() => {
    if (!business && data) {
      const localStorageBusinessId = localStorage.getItem("business_id");
      const _business = data.find((b) => b.id === localStorageBusinessId);
      setBusiness(_business ?? data[0]);
    }
    data && business?.id && localStorage.setItem("business_id", business.id);
  }, [business, data]);

  // Set the AdAccount ID when the business is set
  useEffect(() => {
    if (business) {
      const adAccountProvider = business.socialPages?.find(
        (c) => c.type === SocialPageType.FACEBOOK_AD_ACCOUNT
      );
      if (adAccountProvider?.providerId) {
        setSelectAdAccount(adAccountProvider.providerId);
      }
    }
  }, [business, setSelectAdAccount]);

  return { business, setBusiness, state, dispatch };
};

type UseBusinessContextType = ReturnType<typeof useBusinessContext>;

export const BusinessContext = createContext<UseBusinessContextType>({
  business: null,
  setBusiness: () => {},
  state: initBusinessState,
  dispatch: () => {},
});

const BusinessContextProvider: FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const context = useBusinessContext(null);

  return (
    <BusinessContext.Provider value={context}>
      {children}
    </BusinessContext.Provider>
  );
};

type UseBusinessHookType = {
  state: IBusinessState;
  dispatch: (action: BusinessAction) => void;
  business: IBusinessState;
  setBusiness: (business: IBusinessState) => void;
};

function useBusiness(): UseBusinessHookType {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error(
      "useBusiness must be used within a BusinessContextProvider"
    );
  }

  return context;
}

export { useBusiness, BusinessContextProvider };
