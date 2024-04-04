"use client";

import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import axios, { AxiosError } from "axios";
import { ROUTES } from "@/config/api-config";
import {
  IUserAccount,
  IUserData as IUserDataInterface,
  IUserPage,
} from "@/interfaces/IUser";
import { useSession } from "next-auth/react";
import { useGetMe } from "@/api/user";

export enum SupportedPlatform {
  facebook = "facebook",
  instagram = "instagram",
}

export class Platform {
  static getPlatforms() {
    return Object.values(SupportedPlatform);
  }

  static isSupported(platform: string) {
    return Platform.getPlatforms().includes(platform as SupportedPlatform);
  }
  static getPlatform(platform?: SocialPlatformData) {
    if (!platform)
      return {
        userAccessToken: null,
        pages: null,
        needsLogin: true,
      } as SocialPlatformData;

    return platform;
  }
}

export class FacebookPage {
  static getPage(page?: IUserPage) {
    if (!page)
      return {
        page_access_token: null,
        account_type: "facebook",
        id: "null",
        picture: "null",
        name: "null",
      } as IUserPage;

    return page;
  }
}

export type SocialPlatformData = {
  userAccessToken: string | null;
  pages: IUserPage[] | null;
  needsLogin?: boolean;
};

export type IUserData = IUserDataInterface &
  Record<SupportedPlatform, SocialPlatformData>;

// {
//   facebook: {
//     userAccessToken: string | null;
//     pages: IUserPage[];
//   };
//   instagram: {
//     userAccessToken: string | null;
//     pages: IUserPage[];
//   };
// }

export type UserData = IUserData | null | false;

// An enum with all the types of actions to use in our reducer
enum USER_ACTION_TYPE {
  LINK_ACCOUNT = "LINK_ACCOUNT",
  SET_USER_STATE = "SET_USER_STATE",
  SET_ACCOUNTS = "SET_ACCOUNTS",
  SET_ACCOUNT_DATA = "SET_ACCOUNT_DATA",
  SET_PLATFORM = "SET_PLATFORM",
}

// An interface for our actions
interface UserAction {
  type: USER_ACTION_TYPE;
  payload: any;
}

interface IError {
  message: string;
}

type IUserState = {
  status: "authenticated" | "unauthenticated" | "loading";
  data?: IUserData;
};

export const initUserState: IUserState = {
  status: "loading",
};

function UserReducer(state: IUserState, action: UserAction): IUserState {
  const { type, payload } = action;
  switch (type) {
    case USER_ACTION_TYPE.SET_USER_STATE:
      return {
        ...state,
        status: payload.status,
        data: {
          ...(state.data ?? {}),
          ...payload.data,
        },
      };
    case USER_ACTION_TYPE.SET_ACCOUNTS:
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          accounts: payload,
        },
      };
    case USER_ACTION_TYPE.SET_PLATFORM:
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          [payload.platform]: {
            ...(state.data[payload.platform as SupportedPlatform] ?? {}),
            ...payload.data,
          },
        },
      };
    default:
      return state;
  }
}

const useUserContext = (initState: IUserState) => {
  const [state, dispatch] = useReducer(UserReducer, initState);
  const session = useSession();
  const { data: userData, isSuccess, isError } = useGetMe();
  // const {} = useGetFacebookPro;

  useEffect(() => {
    console.log("Mount Check | User Context mounted - ");
  }, []);

  useEffect(() => {
    if (!isError) return;
    dispatch({
      type: USER_ACTION_TYPE.SET_USER_STATE,
      payload: {
        status: session.status,
        data: null,
      },
    });
  }, [isError, session.status]);

  useEffect(() => {
    if (!userData || !isSuccess) return;
    const user = {
      id: userData.id,
      name: userData.first_name + " " + userData.last_name,
      firstName: userData.first_name,
      lastName: userData.last_name,
      email: userData.email,
      image: userData.image,
      emailVerified: userData.emailVerified,
    };
    dispatch({
      type: USER_ACTION_TYPE.SET_USER_STATE,
      payload: {
        status: session.status,
        data: user,
      },
    });
  }, [session.status, userData, isSuccess]);

  // This useeffect is responsible to update the user data in the context
  // when the session changes
  useEffect(() => {
    if (session.data && session.data.user && session.data.user.token) {
      dispatch({
        type: USER_ACTION_TYPE.SET_USER_STATE,
        payload: {
          status: session.status,
          data: null,
        },
      });
    }
  }, [session]);

  const setFacebookAccessToken = useCallback(
    (userAccessToken: IUserData["facebook"]["userAccessToken"]) => {
      dispatch({
        type: USER_ACTION_TYPE.SET_USER_STATE,
        payload: {
          status: state.status,
          data: {
            ...state.data,
            facebook: {
              userAccessToken,
            },
          },
        },
      });
    },
    [state]
  );

  const setUserPagesData = useCallback(
    (
      platform: SupportedPlatform,
      pages: IUserData[SupportedPlatform]["pages"]
    ) => {
      dispatch({
        type: USER_ACTION_TYPE.SET_PLATFORM,
        payload: {
          platform,
          data: {
            pages,
          },
        },
      });
    },
    []
  );

  const setAccounts = useCallback((accounts: IUserAccount[]) => {
    dispatch({
      type: USER_ACTION_TYPE.SET_ACCOUNTS,
      payload: accounts,
    });

    accounts.forEach((account: IUserAccount) => {
      const platform = account.provider as SupportedPlatform;
      if (Platform.isSupported(platform)) {
        // Setting the user access token for the platform
        dispatch({
          type: USER_ACTION_TYPE.SET_PLATFORM,
          payload: {
            platform,
            data: {
              userAccessToken: account.access_token,
            },
          },
        });
      }
    });
  }, []);

  const setPlatform = useCallback((params: Partial<SocialPlatformData>) => {
    dispatch({
      type: USER_ACTION_TYPE.SET_PLATFORM,
      payload: params,
    });
  }, []);

  return {
    state,
    dispatch,
    setFacebookAccessToken,
    setAccounts,
    setUserPagesData,
    setPlatform,
  };
};

type UseUserContextType = ReturnType<typeof useUserContext>;

export const UserContext = createContext<UseUserContextType>({
  state: initUserState,
  dispatch: (action: UserAction) => {},
  setFacebookAccessToken: (
    userAccessToken: IUserData["facebook"]["userAccessToken"]
  ) => {},
  setUserPagesData: (
    platform: SupportedPlatform,
    pages: IUserData[SupportedPlatform]["pages"]
  ) => {},
  setAccounts: (accounts: IUserAccount[]) => {},
  setPlatform: (params: Partial<SocialPlatformData>) => {},
});

const UserContextProvider: FC<
  { children: React.ReactElement } & IUserState
> = ({ children, ...initState }) => {
  const context = useUserContext(initState);

  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
};

type UseUserHookType = {
  state: IUserState;
  dispatch: (action: UserAction) => void;
  setFacebookAccessToken: (
    userAccessToken: IUserData["facebook"]["userAccessToken"]
  ) => void;
  setUserPagesData: (
    platform: SupportedPlatform,
    pages: IUserData[SupportedPlatform]["pages"]
  ) => void;
  setAccounts: (accounts: IUserAccount[]) => void;
  setPlatform: (params: Partial<SocialPlatformData>) => void;
};

function useUser(): UseUserHookType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }

  return context;
}

export async function linkAccount(
  dispatch: (a: UserAction) => void,
  data: IUserAccount
): Promise<{ ok: boolean; message: string }> {
  dispatch({
    type: USER_ACTION_TYPE.LINK_ACCOUNT,
    payload: data,
  });

  try {
    const response = await axios.post(ROUTES.USERS.LINK_ACCOUNT(data.userId), {
      account: data,
    });

    if (response.data.ok) {
      return {
        ok: true,
        message: "Account linked successfully!",
      };
    }
    return {
      ok: false,
      message: response.data.message ?? "An error occurred!",
    };
  } catch (e) {
    return {
      ok: false,
      message:
        e instanceof AxiosError
          ? e.response?.data.message ?? e.message ?? "An error occurred!"
          : (e as Error).message,
    };
  }
}

// export function startEditingVariant(dispatch: (a: UserAction) => void) {
//   dispatch({
//     type: USER_ACTION_TYPE.START_EDITING_VARIANT,
//     payload: variant,
//   });
// }

export { useUser, UserContextProvider };
