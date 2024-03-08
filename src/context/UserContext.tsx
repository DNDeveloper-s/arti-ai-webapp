"use client";

import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useLayoutEffect,
  useReducer,
} from "react";
import axios, { AxiosError } from "axios";
import { ROUTES } from "@/config/api-config";

interface IUserData {}

export type UserData = IUserData | null | false;

// An enum with all the types of actions to use in our reducer
enum USER_ACTION_TYPE {
  START_EDITING_VARIANT = "START_EDITING_VARIANT",
}

// An interface for our actions
interface UserAction {
  type: USER_ACTION_TYPE;
  payload: any;
}

interface IError {
  message: string;
}

interface IUserState {}

export const initUserState: IUserState = {};

function UserReducer(state: IUserState, action: UserAction): IUserState {
  const { type, payload } = action;
  switch (type) {
    case USER_ACTION_TYPE.START_EDITING_VARIANT:
      return {
        ...state,
        variant: payload,
      };
    default:
      return state;
  }
}

const useUserContext = (initState: IUserState) => {
  const [state, dispatch] = useReducer(UserReducer, initState);

  return { state, dispatch };
};

type UseUserContextType = ReturnType<typeof useUserContext>;

export const UserContext = createContext<UseUserContextType>({
  state: initUserState,
  dispatch: (action: UserAction) => {},
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
};

function useUser(): UseUserHookType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }

  return context;
}

// export function startEditingVariant(dispatch: (a: UserAction) => void) {
//   dispatch({
//     type: USER_ACTION_TYPE.START_EDITING_VARIANT,
//     payload: variant,
//   });
// }

export { useUser, UserContextProvider };
