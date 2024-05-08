import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BusinessForm from "@/components/Business/BusinessForm";
import SnackbarContextProvider from "@/context/SnackbarContext";
import Snackbar from "@/components/Snackbar";
import Providers from "@/app/providers";
import { UserContextProvider } from "@/context/UserContext";
import { BusinessContextProvider } from "@/context/BusinessContext";
import {
  ConversationContextProvider,
  initConversationState,
} from "@/context/ConversationContext";
import { EditVariantContextProvider } from "@/context/EditVariantContext";
import { Button } from "@nextui-org/react";
import { AiFillFacebook } from "react-icons/ai";
import { useGetUserProviders } from "@/api/user";
import { act } from "react-dom/test-utils";
import { useRegisterBusiness } from "@/api/conversation";
import { renderHook } from "@testing-library/react-hooks";

const mockConfig = {
  renderComponent: () =>
    render(
      <Providers>
        <UserContextProvider status="loading">
          <SnackbarContextProvider>
            <BusinessContextProvider>
              <ConversationContextProvider {...initConversationState}>
                <EditVariantContextProvider>
                  <>
                    <BusinessForm />
                    <Snackbar />
                  </>
                </EditVariantContextProvider>
              </ConversationContextProvider>
            </BusinessContextProvider>
          </SnackbarContextProvider>
        </UserContextProvider>
      </Providers>
    ),
  testIds: {
    nameInput: "name",
    categoryInput: "category",
    positionInput: "position",
    websiteInput: "website",
    detailsInput: "details",
    submitButton: "submit-business-button",
    connectFacebookButton: "connect-facebook-button",
    selectAdAccountControl: "select-ad-account-control",
    selectMetaPageControl: "select-meta-page-control",
    selectInstagramPageControl: "select-instagram-page-control",
  },
  mockValues: {
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
    password: "password123",
  },
  testUser: {
    //   createdAt: null | string;
    // email: string;
    // emailVerified: null | boolean;
    // first_name: string;
    // id: string;
    // image: null | string;
    // last_name: string;
    // updatedAt: null | string;
    createdAt: null,
    email: "test@example.com",
    emailVerified: null,
    first_name: "Test",
    id: "123",
    image: null,
    last_name: "User",
    updatedAt: null,
  },
};

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  })),
}));

jest.mock("@/api/user", () => ({
  useGetUserProviders: jest.fn(() => ({
    data: [],
    isFetching: false,
  })),
  useGetMe: jest.fn(() => ({
    data: mockConfig.testUser,
    isSuccess: true,
    isFetching: false,
  })),
  useUserPages: jest.fn(() => ({
    data: undefined,
    isFetching: false,
  })),
  useGetAdAccounts: jest.fn(() => ({
    data: undefined,
    isFetching: false,
  })),
  useLinkAccount: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
  })),
}));

jest.mock("@/api/conversation", () => ({
  useRegisterBusiness: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
  })),
  useUpdateBusiness: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
  })),
  useQueryUserBusiness: jest.fn(() => ({
    data: undefined,
    isFetching: false,
  })),
  useGetBusiness: jest.fn(() => ({
    data: undefined,
    isFetching: false,
  })),
}));

// Mock signIn function
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(() => ({ error: "Invalid credentials" })),
  useSession: jest.fn(() => {
    return { data: { user: {} }, status: "authenticated" };
  }),
}));

// jest.mock("react-hook-form", () => ({
//   ...jest.requireActual("react-hook-form"), // Use actual implementation for other functions
// }));

jest.mock("react-facebook-login/dist/facebook-login-render-props", () =>
  jest.fn()
);

HTMLFormElement.prototype.requestSubmit = jest.fn();

// Mock axios post
jest.mock("axios", () => ({
  post: jest.fn().mockResolvedValueOnce({
    data: { message: "We will get back to you soon.", ok: true },
  }),
  interceptors: {
    response: {
      use: jest.fn(),
    },
    request: {
      use: jest.fn(),
    },
  },
}));

describe("BusinessForm Component", () => {
  let nameInput: HTMLElement;
  let categoryInput: HTMLElement;
  let positionInput: HTMLElement;
  let websiteInput: HTMLElement;
  let detailsInput: HTMLElement;
  let submitButton: HTMLElement;
  let mockRegisterBusiness: jest.Mock;
  let unmount: () => void;

  beforeEach(() => {
    jest.useFakeTimers();

    if (unmount) unmount();

    const { unmount: _unmount } = mockConfig.renderComponent();
    unmount = _unmount;

    jest.spyOn(console, "warn").mockImplementation(() => {});

    nameInput = screen.getByTestId(mockConfig.testIds.nameInput);
    categoryInput = screen.getByTestId(mockConfig.testIds.categoryInput);
    positionInput = screen.getByTestId(mockConfig.testIds.positionInput);
    websiteInput = screen.getByTestId(mockConfig.testIds.websiteInput);
    detailsInput = screen.getByTestId(mockConfig.testIds.detailsInput);
    submitButton = screen.getByTestId(mockConfig.testIds.submitButton);
  });

  // afterAll(() => {
  //   jest.useRealTimers();
  //   if (unmount) unmount();
  // });

  it("renders the form correctly", () => {
    // Assert that all necessary form elements are rendered
    expect(screen.getByText("Register Business")).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
    expect(positionInput).toBeInTheDocument();
    expect(websiteInput).toBeInTheDocument();
    expect(detailsInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    // Add more assertions for other form elements
  });

  it("Shows the Connect Facebook button if there is no facebook provider", () => {
    const connectFacebookButton = screen.getByTestId(
      mockConfig.testIds.connectFacebookButton
    );

    expect(connectFacebookButton).toBeInTheDocument();
  });

  it("handles user input correctly", () => {
    // Simulate user input for each form field
    // act(() => {
    // fireEvent.change(nameInput, { target: { value: "Test Business" } });
    // userEvent.type(nameInput, "Test Business");
    // });
    fireEvent.input(screen.getByRole("textbox", { name: /name/i }), {
      target: {
        value: "Test Business",
      },
    });

    // Add similar events for other form fields
    // Verify that form fields update correctly
    expect(nameInput).toHaveValue("Test Business");
  });

  it("Shows the Select Ad Account/Select Meta Page/Select Instagram Page Dropdown if there is ad account provider", () => {
    (useGetUserProviders as jest.Mock).mockRestore();
    // Mock the useGetUserProviders hook to return ad account provider
    (useGetUserProviders as jest.Mock).mockReturnValue({
      data: [{ provider: "facebook" }],
      isFetching: false,
    });
    unmount && unmount();
    mockConfig.renderComponent();
    // Assert that the Select Ad Account button is rendered
    const selectAdAccountControl = screen.getByTestId(
      mockConfig.testIds.selectAdAccountControl
    );
    const selectMetaPageControl = screen.getByTestId(
      mockConfig.testIds.selectMetaPageControl
    );
    const selectInstagramPageControl = screen.getByTestId(
      mockConfig.testIds.selectInstagramPageControl
    );
    expect(selectAdAccountControl).toBeInTheDocument();
    expect(selectMetaPageControl).toBeInTheDocument();
    expect(selectInstagramPageControl).toBeInTheDocument();
  });

  it("submits the form with valid data", async () => {
    // Fill in valid data in form fields
    // Simulate form submission
    // const submitButton = screen.getByText("Register");
    // fireEvent.click(submitButton);
    // Add assertions for form submission

    mockConfig.renderComponent();

    // act(() => {
    fireEvent.change(nameInput, { target: { value: "Test Business" } });
    fireEvent.input(categoryInput, { target: { value: "Fitness" } });
    fireEvent.change(positionInput, { target: { value: "Test Position" } });
    fireEvent.change(websiteInput, { target: { value: "https://test.com" } });
    fireEvent.change(detailsInput, { target: { value: "Test Details" } });
    fireEvent.click(submitButton);
    // });
    mockRegisterBusiness = jest.fn();
    (useRegisterBusiness as jest.Mock).mockReturnValue({
      mutate: mockRegisterBusiness,
      isPending: true,
    });

    await waitFor(() => {
      // Assert that form submission function is called with correct data
      // Assert any side effects of form submission
      // expect(mockRegisterBusiness).toHaveBeenCalledWith({
      //   name: "Test Business",
      //   category: "Fitness",
      //   position: "Test Position",
      //   website: "https://test.com",
      //   details: "Test Details",
      // });
      expect(submitButton).toBeDisabled();
    });
  });

  // it("displays validation errors for invalid data", () => {
  //   render(<BusinessForm />);
  //   // Fill in invalid data in form fields
  //   // Trigger form validation
  //   const submitButton = screen.getByText("Register");
  //   fireEvent.click(submitButton);
  //   // Assert that validation errors are displayed for invalid fields
  //   expect(screen.getByText("Name is required")).toBeInTheDocument();
  //   // Add similar assertions for other validation errors
  // });

  //   it("renders conditional components based on form state", () => {
  //     render(<BusinessForm />);
  //     // Simulate changing form state to trigger conditional rendering
  //     // Assert that conditional components are rendered as expected
  //   });

  //   it("handles form submission errors gracefully", async () => {
  //     render(<BusinessForm />);
  //     // Mock API call to simulate form submission error
  //     // Simulate form submission
  //     const submitButton = screen.getByText("Register");
  //     fireEvent.click(submitButton);
  //     // Add assertions to check that error message is displayed
  //     await waitFor(() => {
  //       // Assert that error message is displayed
  //     });
  //   });
});
