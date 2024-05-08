import Providers from "@/app/providers";
import { CurrentConversationContextProvider } from "@/context/CurrentConversationContext";
import { EditVariantContextProvider } from "@/context/EditVariantContext";
import SnackbarContextProvider from "@/context/SnackbarContext";
import { UserContextProvider } from "@/context/UserContext";
import {
  getMessagesMock,
  mockConversationState,
  mockGetConversation,
} from "../../../__mocks__/conversations";
import { ClientMessageContextProvider } from "@/context/ClientMessageContext";
import Snackbar from "@/components/Snackbar";
import { render, screen } from "@testing-library/react";
import ArtiBotV2 from "@/components/ArtiBot/v2/ArtiBot";
import { useSession } from "../../../__mocks__/user";
import { useGetMessages } from "@/api/conversation-new";
import { useGetBusinessMock } from "../../../__mocks__/business";

jest.mock("@canvasjs/react-charts", () => jest.fn());
jest.mock("react-facebook-login/dist/facebook-login-render-props", () =>
  jest.fn()
);

const mockConfig = {
  renderComponent: () =>
    render(
      <Providers>
        <UserContextProvider status="loading">
          <SnackbarContextProvider>
            <EditVariantContextProvider>
              <CurrentConversationContextProvider
                conversation={mockGetConversation().data as any}
              >
                <ClientMessageContextProvider>
                  <>
                    <ArtiBotV2 hideHeader={true} />
                    <Snackbar />
                  </>
                </ClientMessageContextProvider>
              </CurrentConversationContextProvider>
            </EditVariantContextProvider>
          </SnackbarContextProvider>
        </UserContextProvider>
      </Providers>
    ),
};

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  redirect: jest.fn(),
  useRouter: jest.fn(() => ({
    query: {
      conversation_type: "662f76eca204580d19592ad4",
    },
    push: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((params: string) => {
      if (params === "conversation_id") {
        return "662f76eca204580d19592ad4";
      }
    }),
  })),
}));
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => useSession()),
}));

jest.mock("@/context/BusinessContext", () => ({
  useBusiness: jest.fn(() => ({
    business: useGetBusinessMock(),
  })),
}));
const getMessagesObject = {
  data: {
    pages: getMessagesMock(),
    pageParams: undefined,
  },
  isLoading: false,
  hasNextPage: false,
  isFetching: false,
  isFetchingNextPage: false,
  isSuccess: false,
  fetchNextPage: jest.fn(),
  fetchPreviousPage: jest.fn(),
  hasPreviousPage: false,
};

jest.mock("@/api/conversation-new", () => ({
  useGetMessages: jest.fn(() => getMessagesObject),
}));

describe("Message Chat Screen", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    (useGetMessages as jest.Mock).mockReset();
  });
  it("loads the shimmer when the conversation is loading", () => {
    (useGetMessages as jest.Mock).mockReturnValueOnce({
      ...getMessagesObject,
      isLoading: true,
    });
    const { getByTestId } = mockConfig.renderComponent();
    expect(getByTestId("conversation-messages-shimmer")).toBeInTheDocument();
  });
  describe("when the messages are fetched and message does not have hasNextPage", () => {
    beforeEach(() => {
      (useGetMessages as jest.Mock).mockReturnValueOnce(getMessagesObject);
    });
    it("loads the welcome message", () => {
      mockConfig.renderComponent();
      const messageItems = screen.getAllByTestId("conversation-message-item");
      expect(messageItems[0]).toHaveAttribute(
        "data-messagetype",
        "welcome-message"
      );
    });
  });
  describe("when the messages are fetched and message hasNextPage", () => {
    beforeEach(() => {
      (useGetMessages as jest.Mock).mockReturnValueOnce({
        ...getMessagesObject,
        hasNextPage: true,
      });
    });
    it("loads the text messages correctly when the messages are being fetched", () => {
      mockConfig.renderComponent();
      const messageItems = screen.getAllByTestId("conversation-message-item");
      expect(messageItems).toHaveLength(10);
    });
  });
});
