import Providers from "@/app/providers";
import Snackbar from "@/components/Snackbar";
import { BusinessContextProvider } from "@/context/BusinessContext";
import {
  ConversationContextProvider,
  initConversationState,
} from "@/context/ConversationContext";
import { EditVariantContextProvider } from "@/context/EditVariantContext";
import SnackbarContextProvider from "@/context/SnackbarContext";
import { UserContextProvider } from "@/context/UserContext";
import { screen, render } from "@testing-library/react";
import { useSession } from "../../../../__mocks__/user";
import {
  useConversationMock,
  useGetConversationInfiniteMock,
  mockGetConversation,
} from "../../../../__mocks__/conversations";
import { CurrentConversationContextProvider } from "@/context/CurrentConversationContext";
import { ClientMessageContextProvider } from "@/context/ClientMessageContext";
import ConversationSection from "@/components/ArtiBot/LeftPane/ConversationSection";

const mockConfig = {
  renderComponent: () =>
    render(
      <Providers>
        <UserContextProvider status="loading">
          <SnackbarContextProvider>
            <BusinessContextProvider>
              <ConversationContextProvider {...initConversationState}>
                <EditVariantContextProvider>
                  <CurrentConversationContextProvider
                    conversation={mockGetConversation().data as any}
                  >
                    <ClientMessageContextProvider>
                      <>
                        <ConversationSection
                          onSectionActive={jest.fn()}
                          isActive={true}
                        />
                        <Snackbar />
                      </>
                    </ClientMessageContextProvider>
                  </CurrentConversationContextProvider>
                </EditVariantContextProvider>
              </ConversationContextProvider>
            </BusinessContextProvider>
          </SnackbarContextProvider>
        </UserContextProvider>
      </Providers>
    ),
};

// jest.mock("@canvasjs/react-charts", () => jest.fn());

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

jest.mock("@/api/conversation-new", () => ({
  useGetConversationInfinite: jest.fn(() => ({
    data: {
      pages: useGetConversationInfiniteMock(),
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
  })),
}));

describe("DashboardScreen", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    jest.mock("@/context/ConversationContext", () => ({
      useConversation: jest.fn(() => useConversationMock()),
    }));
    jest.mock("@/context/CurrentConversationContext", () => ({
      useCurrentConversation: jest.fn(() => ({
        conversation: mockGetConversation().data,
      })),
    }));
  });

  it("should render the conversation list", () => {
    mockConfig.renderComponent();
    expect(screen.getByTestId("conversations-list-header")).toBeInTheDocument();
  });

  it("should render the conversation list item correctly", () => {
    mockConfig.renderComponent();

    const listItems = screen.getAllByTestId("conversation-list-item");
    expect(listItems).toHaveLength(10);
    expect(listItems[0]).toHaveAttribute(
      "data-conversation",
      useGetConversationInfiniteMock()[0].id
    );
    expect(listItems[5]).toHaveAttribute(
      "data-conversation",
      useGetConversationInfiniteMock()[5].id
    );
  });

  it("should have the active class on the active conversation", () => {
    mockConfig.renderComponent();

    const listItems = screen.getAllByTestId("conversation-list-item");
    expect(listItems[0]).toHaveClass("active");
  });
});
