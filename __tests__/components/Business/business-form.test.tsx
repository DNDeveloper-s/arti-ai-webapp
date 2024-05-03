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
  },
  mockValues: {
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
    password: "password123",
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
}));

// Mock signIn function
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(() => ({ error: "Invalid credentials" })),
  useSession: jest.fn(() => {
    return { data: { user: {} }, status: "authenticated" };
  }),
}));

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

  beforeAll(() => {
    jest.useFakeTimers();

    mockConfig.renderComponent();

    nameInput = screen.getByTestId(mockConfig.testIds.nameInput);
    categoryInput = screen.getByTestId(mockConfig.testIds.categoryInput);
    positionInput = screen.getByTestId(mockConfig.testIds.positionInput);
    websiteInput = screen.getByTestId(mockConfig.testIds.websiteInput);
    detailsInput = screen.getByTestId(mockConfig.testIds.detailsInput);
    submitButton = screen.getByTestId(mockConfig.testIds.submitButton);
  });

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

  //   it("handles user input correctly", () => {
  //     render(<BusinessForm />);
  //     // Simulate user input for each form field
  //     const businessNameInput = screen.getByLabelText("Business Name");
  //     userEvent.type(businessNameInput, "Test Business");
  //     // Add similar events for other form fields
  //     // Verify that form fields update correctly
  //     expect(businessNameInput).toHaveValue("Test Business");
  //   });

  //   it("submits the form with valid data", async () => {
  //     render(<BusinessForm />);
  //     // Fill in valid data in form fields
  //     // Simulate form submission
  //     const submitButton = screen.getByText("Register");
  //     fireEvent.click(submitButton);
  //     // Add assertions for form submission
  //     await waitFor(() => {
  //       // Assert that form submission function is called with correct data
  //       // Assert any side effects of form submission
  //     });
  //   });

  //   it("displays validation errors for invalid data", () => {
  //     render(<BusinessForm />);
  //     // Fill in invalid data in form fields
  //     // Trigger form validation
  //     const submitButton = screen.getByText("Register");
  //     fireEvent.click(submitButton);
  //     // Assert that validation errors are displayed for invalid fields
  //     expect(screen.getByText("Name is required")).toBeInTheDocument();
  //     // Add similar assertions for other validation errors
  //   });

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
