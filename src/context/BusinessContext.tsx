"use client";

import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IBusinessResponse,
  SocialPageObject,
  SocialPageType,
  useGetConversation,
  useQueryUserBusiness,
} from "@/api/conversation";
import { IConversation } from "@/interfaces/IConversation";
import useCampaignStore from "@/store/campaign";
import { set } from "lodash";
import useSessionToken from "@/hooks/useSessionToken";

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

class Business {
  id?: string;
  name?: string;
  social_pages?: SocialPageObject[];

  constructor(data?: IBusinessResponse) {
    this.id = data?.id;
    this.name = data?.name;
    this.social_pages = data?.social_pages;
  }

  getFacebookPage() {
    return this.social_pages?.find(
      (page) => page.type === SocialPageType.FACEBOOK_PAGE
    );
  }

  getAdAccount() {
    return this.social_pages?.find(
      (page) => page.type === SocialPageType.FACEBOOK_AD_ACCOUNT
    );
  }

  static fromData(data?: IBusinessResponse) {
    return new Business(data);
  }

  static fromLocalStorage() {
    const data = localStorage.getItem("business");
    if (data) {
      return Business.fromData(JSON.parse(data));
    }
    return null;
  }

  static setLocalStorage(data?: IBusinessResponse) {
    localStorage.setItem("business", JSON.stringify(data));
  }

  static clearLocalStorage() {
    localStorage.removeItem("business");
  }

  static getLocalStorage() {
    const data = localStorage.getItem("business");
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  static setLocalStorageId(id: string) {
    localStorage.setItem("business_id", id);
  }

  static getLocalStorageId() {
    return localStorage.getItem("business_id");
  }

  static clearLocalStorageId() {
    localStorage.removeItem("business_id");
  }
}

const useBusinessContext = (initState: IBusinessState) => {
  const [state, dispatch] = useReducer(BusinessReducer, initState);
  const [business, setBusiness] = useState<IBusinessState>(null);
  const { data } = useQueryUserBusiness();
  const { setSelectAdAccount } = useCampaignStore();
  const selectedBusinessIdRef = useRef<string | null>(null);
  const token = useSessionToken();

  useEffect(() => {
    if (!token) return;
    if (!selectedBusinessIdRef.current && data) {
      const localStorageBusinessId = localStorage.getItem("business_id");
      const _business = data.find((b) => b.id === localStorageBusinessId);
      const businessToSelect = _business ?? data[0];

      if (!businessToSelect) return;

      setBusiness(businessToSelect);
      selectedBusinessIdRef.current = businessToSelect.id;
      localStorage.setItem("business_id", selectedBusinessIdRef.current);
      const adAccountProvider = businessToSelect.social_pages?.find(
        (c) => c.type === SocialPageType.FACEBOOK_AD_ACCOUNT
      );
      setSelectAdAccount(adAccountProvider?.provider_id);
    }

    if (selectedBusinessIdRef.current && data) {
      const _business = data.find(
        (b) => b.id === selectedBusinessIdRef.current
      );
      const businessToSelect = _business ?? data[0];
      if (!businessToSelect) return;
      setBusiness(businessToSelect);
      selectedBusinessIdRef.current = businessToSelect.id;
      localStorage.setItem("business_id", selectedBusinessIdRef.current);
      const adAccountProvider = businessToSelect.social_pages?.find(
        (c) => c.type === SocialPageType.FACEBOOK_AD_ACCOUNT
      );
      setSelectAdAccount(adAccountProvider?.provider_id);
    }
  }, [data, setSelectAdAccount, token]);

  // Set the AdAccount ID when the business is set
  useEffect(() => {
    if (business) {
      // console.log('Resetting the route for switched business')
      // router.push('artibot')
      const adAccountProvider = business.social_pages?.find(
        (c) => c.type === SocialPageType.FACEBOOK_AD_ACCOUNT
      );
      setSelectAdAccount(adAccountProvider?.provider_id);
      selectedBusinessIdRef.current = business.id;
      localStorage.setItem("business_id", business.id);
    }
  }, [business, setSelectAdAccount]);

  const businessMap = useMemo(() => {
    const _business = data?.find((b) => b.id === business?.id);
    return new Business(_business);
  }, [business, data]);

  const [businessId, setBusinessId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const localBusinessId = window.localStorage.getItem("business_id");
    if (localBusinessId) {
      setBusinessId(localBusinessId);
    }
  }, []);

  return {
    businessMap,
    business,
    setBusiness,
    state,
    dispatch,
    businessId: business?.id ?? businessId,
  };
};

type UseBusinessContextType = ReturnType<typeof useBusinessContext>;

export const BusinessContext = createContext<UseBusinessContextType>({
  business: null,
  setBusiness: () => {},
  state: initBusinessState,
  dispatch: () => {},
  businessMap: new Business(),
  businessId: undefined,
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
  businessMap: Business;
  setBusiness: (business: IBusinessState) => void;
  businessId: string;
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
