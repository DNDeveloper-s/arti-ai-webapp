"use client";

import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useSearchParams } from "next/navigation";
import { useGetConversation } from "@/api/conversation";
import { IConversation } from "@/interfaces/IConversation";

type ICurrentConversationState = {
  conversation: IConversation | undefined;
};

export const initCurrentConversationState: ICurrentConversationState = {
  conversation: undefined,
};

enum CURRENT_CONVERSATION_ACTION_TYPE {
  SET = "SET",
}

interface CurrentConversationAction {
  type: CURRENT_CONVERSATION_ACTION_TYPE;
  payload: Partial<ICurrentConversationState>;
}

function CurrentConversationReducer(
  state: ICurrentConversationState,
  action: CurrentConversationAction
): ICurrentConversationState {
  const { type, payload } = action;
  switch (type) {
    case CURRENT_CONVERSATION_ACTION_TYPE.SET:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}

const useCurrentConversationContext = (
  initState: ICurrentConversationState
) => {
  const [state, dispatch] = useReducer(CurrentConversationReducer, initState);

  useEffect(() => {
    console.log("initState - ", initState);
  }, [initState]);

  return {
    state,
    dispatch,
    conversation: initState.conversation,
  };
};

type UseCurrentConversationContextType = ReturnType<
  typeof useCurrentConversationContext
>;

export const CurrentConversationContext =
  createContext<UseCurrentConversationContextType>({
    state: initCurrentConversationState,
    dispatch: (action: CurrentConversationAction) => {},
    conversation: undefined,
  });

const CurrentConversationContextProvider: FC<
  { children: React.ReactElement } & ICurrentConversationState
> = ({ children, ...initState }) => {
  const context = useCurrentConversationContext(initState);

  return (
    <CurrentConversationContext.Provider value={context}>
      {children}
    </CurrentConversationContext.Provider>
  );
};

type UseCurrentConversationHookType = {
  state: ICurrentConversationState;
  dispatch: (action: CurrentConversationAction) => void;
  conversation: IConversation | undefined;
};

function useCurrentConversation(): UseCurrentConversationHookType {
  const context = useContext(CurrentConversationContext);
  if (context === undefined) {
    throw new Error(
      "useCurrentConversation must be used within a CurrentConversationContextProvider"
    );
  }

  return context;
}

export { useCurrentConversation, CurrentConversationContextProvider };
