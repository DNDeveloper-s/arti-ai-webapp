"use client";

import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  SendMessageVariables,
  useGetConversation,
  useSaveMessages,
  useSendMessage,
} from "@/api/conversation";
import { IConversation } from "@/interfaces/IConversation";
import { IAdCreativeWithVariants } from "@/interfaces/IAdCreative";
import { useQueryClient } from "@tanstack/react-query";
import API_QUERIES from "@/config/api-queries";
import { useCurrentConversation } from "./CurrentConversationContext";
import { ChatGPTRole } from "@/interfaces/IArtiBot";
import { sortBy } from "lodash";
import { message } from "antd";
import ObjectID from "bson-objectid";

interface ClientMessage {
  id: string;
  content: string;
  role: ChatGPTRole;
  done: boolean;
  conversationId?: string;
  adCreatives?: IAdCreativeWithVariants[];
  archived?: boolean;
  createdAt: number;
}

type IClientMessageState = {
  messageRecord: ClientMessageRecord;
};

class ClientMessageRecord {
  list: ClientMessage[] = [];

  constructor(list: ClientMessage[] = []) {
    this.list = list;
  }

  add(message: ClientMessage) {
    this.list.push(message);
  }

  set(message: ClientMessage): ClientMessageRecord {
    const clonedRecord = this.clone();
    const index = clonedRecord.list.findIndex((m) => m.id === message.id);
    if (index === -1) {
      clonedRecord.add(message);
    } else {
      clonedRecord.list[index] = message;
    }
    return clonedRecord;
  }

  setIn(message: ClientMessage) {
    const index = this.list.findIndex((m) => m.id === message.id);
    if (index === -1) {
      this.add(message);
    } else {
      this.list[index] = message;
    }
  }

  merge(messages: ClientMessage[]): ClientMessageRecord {
    const clonedRecord = this.clone();
    messages.forEach((message) => {
      clonedRecord.setIn(message);
    });
    return clonedRecord;
  }

  clone(): ClientMessageRecord {
    return new ClientMessageRecord([...this.list]);
  }

  get(id: string) {
    return this.list.find((m) => m.id === id && !m.archived);
  }

  getByConversationId(conversationId: string | undefined | null) {
    if (!conversationId) return [];
    return this.list.filter(
      (m) => m.conversationId === conversationId && !m.archived
    );
  }

  getLastTwoMessagesByConversationId(conversationId: string) {
    const list = sortBy(
      this.list.filter(
        (m) => m.conversationId === conversationId && !m.archived
      ),
      "id"
    ).slice(-2);
    const newMessageRecord = new ClientMessageRecord(list);
    return newMessageRecord;
  }

  format() {
    return this.list.map((m) => ({
      content: m.content,
      role: m.role,
    }));
  }

  archiveByConversation(conversationId: string) {
    const clonedRecord = this.clone();
    clonedRecord.list = clonedRecord.list.map((m) => {
      if (m.conversationId === conversationId) {
        return {
          ...m,
          archived: true,
        };
      }
      return m;
    });
    return clonedRecord;
  }

  archiveById(id: string) {
    const clonedRecord = this.clone();
    const index = clonedRecord.list.findIndex((m) => m.id === id);
    if (index !== -1) {
      clonedRecord.list[index] = {
        ...clonedRecord.list[index],
        archived: true,
      };
    }
    return clonedRecord;
  }

  toString() {
    return this.list;
  }

  getByCurrentConversation(): ClientMessage[] {
    return [];
  }
}

export const initClientMessageState: IClientMessageState = {
  messageRecord: new ClientMessageRecord(),
};

enum CLIENT_MESSAGE_ACTION_TYPE {
  SET = "SET",
  SET_MESSAGE_DATA = "SET_MESSAGE_DATA",
}

interface ClientMessageAction {
  type: CLIENT_MESSAGE_ACTION_TYPE;
  payload: any;
}

function ClientMessageReducer(
  state: IClientMessageState,
  action: ClientMessageAction
): IClientMessageState {
  const { type, payload } = action;
  switch (type) {
    case CLIENT_MESSAGE_ACTION_TYPE.SET:
      return {
        ...state,
        ...payload,
      };
    case CLIENT_MESSAGE_ACTION_TYPE.SET_MESSAGE_DATA:
      const record = state.messageRecord.merge(payload.messages);
      console.log("Testing | record - ", record, payload.messages);
      return {
        ...state,
        messageRecord: record,
      };
    default:
      return state;
  }
}

const useClientMessageContext = (initState: IClientMessageState) => {
  const [state, dispatch] = useReducer(ClientMessageReducer, initState);
  const { conversation } = useCurrentConversation();

  const {
    data,
    mutate: postSendMessage,
    isPending,
    isGeneratingJson,
    isDone,
  } = useSendMessage();

  useEffect(() => {
    if (data?.data?.id) {
      dispatch({
        type: CLIENT_MESSAGE_ACTION_TYPE.SET_MESSAGE_DATA,
        payload: {
          messages: [data.data],
        },
      });
    }
  }, [data]);

  // useEffect(() => {
  //   if (isDone && data?.data && conversation) {
  //     const messages = state.messageRecord
  //       .getLastTwoMessagesByConversationId(conversation.id)
  //       .format();
  //     if (!messages || messages.length !== 2) {
  //       console.error("Error: No messages found");
  //       return;
  //     }
  //     postSaveMessages({
  //       conversationId: data.data.conversationId,
  //       conversationType: conversation.conversation_type,
  //       projectName: conversation.project_name,
  //       messages: messages,
  //     });
  //   }
  // }, [isDone, data, postSaveMessages, conversation, state.messageRecord]);

  const sendMessage = (variables: SendMessageVariables) => {
    dispatch({
      type: CLIENT_MESSAGE_ACTION_TYPE.SET_MESSAGE_DATA,
      payload: {
        messages: [
          {
            id: variables.messages[0].id,
            content: variables.messages[0].content,
            role: variables.messages[0].role,
            done: true,
            conversationId: conversation?.id,
            createdAt: Date.now(),
          },
          {
            id: variables.serverGeneratedMessageId,
            content: "",
            role: ChatGPTRole.ASSISTANT,
            done: false,
            conversationId: conversation?.id,
            createdAt: Date.now(),
          },
        ],
      },
    });
    postSendMessage(variables);
  };

  const archiveByConversationId = (conversationId: string) => {
    dispatch({
      type: CLIENT_MESSAGE_ACTION_TYPE.SET,
      payload: {
        messageRecord:
          state.messageRecord.archiveByConversation(conversationId),
      },
    });
  };

  useEffect(() => {
    ClientMessageRecord.prototype.getByCurrentConversation = function () {
      return this.getByConversationId(conversation?.id);
    };
  }, [conversation]);

  return {
    dispatch,
    sendMessage,
    isPending,
    isGeneratingJson,
    messageRecord: state.messageRecord,
    archiveByConversationId,
  };
};

type UseClientMessageContextType = ReturnType<typeof useClientMessageContext>;

export const ClientMessageContext = createContext<UseClientMessageContextType>({
  dispatch: (action: ClientMessageAction) => {},
  sendMessage: async (variables: SendMessageVariables) => {},
  isPending: false,
  isGeneratingJson: false,
  messageRecord: new ClientMessageRecord(),
  archiveByConversationId: (conversationId: string) => {},
});

const ClientMessageContextProvider: FC<
  { children: React.ReactElement } & Partial<IClientMessageState>
> = ({ children, ...initialState }) => {
  const context = useClientMessageContext({
    ...initClientMessageState,
    ...initialState,
  });

  return (
    <ClientMessageContext.Provider value={context}>
      {children}
    </ClientMessageContext.Provider>
  );
};

type UseClientMessageHookType = {
  dispatch: (action: ClientMessageAction) => void;
  sendMessage: (variables: SendMessageVariables) => void;
  isPending: boolean;
  isGeneratingJson: boolean;
  messageRecord: ClientMessageRecord;
  archiveByConversationId: (conversationId: string) => void;
};

function useClientMessages(): UseClientMessageHookType {
  const context = useContext(ClientMessageContext);
  if (context === undefined) {
    throw new Error(
      "useClientMessage must be used within a ClientMessageContextProvider"
    );
  }

  return context;
}

export { useClientMessages, ClientMessageContextProvider };
