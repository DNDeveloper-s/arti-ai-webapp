import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getServerSession } from "next-auth/next";
import LandingPage from "../src/components/ProductPage/ProductLandingPage";
import Contact from "@/components/ProductPage/Contact";
import SnackbarContextProvider, {
  ISnackbarData,
} from "@/context/SnackbarContext";
import exp from "constants";
import axios from "axios";

const mockConfig = {
  renderComponent: () =>
    render(
      <SnackbarContextProvider>
        <Contact />
      </SnackbarContextProvider>
    ),
  title: "Join Waitlist",
  testIds: {
    company: "Company",
    email: "Email",
    companyInput: "company-input",
    emailInput: "email-input",
    fullNameInput: "full_name-input",
    messageInput: "message-input",
    budgetRadioContainer: "budget-radio-container",
    budgetRadio: "$0",
    submitButton: "submit-contact-button",
  },
  mockValues: {
    company: "Test Company",
    email: "test@example.com",
    fullName: "Test Saurabh",
    message: "This is a test message",
    budget: "$0",
  },
  response: {
    success: {
      message: "We will get back to you soon.",
      status: "success",
    },
  },
};

// Mock getServerSession function
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));
jest.mock("axios", () => ({
  post: jest.fn().mockResolvedValueOnce({
    data: { message: "We will get back to you soon.", ok: true },
  }),
}));

const hasSnackbar = (status: ISnackbarData["status"], message: string) => {
  const snackbarEl = screen.getByTestId("snackbar-container");
  expect(snackbarEl).toBeInTheDocument();

  const snackbarMessage = screen.getByTestId("snackbar-message");
  expect(snackbarMessage).toBeInTheDocument();
  expect(snackbarMessage).toHaveTextContent(message);

  const snackbarStatus = screen.getByTestId("snackbar-status");
  expect(snackbarStatus).toBeInTheDocument();
  expect(snackbarStatus).toHaveTextContent(status);
};

describe("Home component", () => {
  it("renders Contact section", async () => {
    // Mock the session to be null
    mockConfig.renderComponent();

    // Assert that ProductLandingPage is rendered
    expect(screen.getByText(mockConfig.title)).toBeInTheDocument();
  });

  it("renders all form fields and labels", () => {
    mockConfig.renderComponent();
    // You can use testing-library queries to check if all form fields and labels are rendered as expected

    expect(screen.getByTestId(mockConfig.testIds.company)).toBeInTheDocument();
    expect(screen.getByTestId(mockConfig.testIds.email)).toBeInTheDocument();
    expect(
      screen.getByTestId(mockConfig.testIds.fullNameInput)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(mockConfig.testIds.messageInput)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(mockConfig.testIds.budgetRadioContainer)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(mockConfig.testIds.budgetRadio)
    ).toBeInTheDocument();
  });

  it("handles user input correctly", async () => {
    mockConfig.renderComponent();
    const companyInput = screen.getByTestId(mockConfig.testIds.companyInput);
    const emailInput = screen.getByTestId(mockConfig.testIds.emailInput);
    const fullNameInput = screen.getByTestId(mockConfig.testIds.fullNameInput);
    const messageInput = screen.getByTestId(mockConfig.testIds.messageInput);

    fireEvent.change(companyInput, {
      target: { value: mockConfig.mockValues.company },
    });
    fireEvent.change(emailInput, {
      target: { value: mockConfig.mockValues.email },
    });
    fireEvent.change(fullNameInput, {
      target: { value: mockConfig.mockValues.fullName },
    });
    fireEvent.change(messageInput, {
      target: { value: mockConfig.mockValues.message },
    });

    const budgetRadioList = screen.getByTestId(
      mockConfig.testIds.budgetRadioContainer
    );
    expect(budgetRadioList).toBeInTheDocument();

    const budgetRadio = screen.getByTestId(mockConfig.testIds.budgetRadio);
    fireEvent.click(budgetRadio);

    expect(companyInput).toHaveValue(mockConfig.mockValues.company);
    expect(emailInput).toHaveValue(mockConfig.mockValues.email);
    expect(fullNameInput).toHaveValue(mockConfig.mockValues.fullName);
    expect(messageInput).toHaveValue(mockConfig.mockValues.message);
    expect(budgetRadio).toBeChecked();
  });

  it("button stays disabled on invalid input", async () => {
    mockConfig.renderComponent();
    const submitButton = screen.getByTestId(mockConfig.testIds.submitButton);

    expect(submitButton).toBeDisabled();
  });

  it("submits the form on valid input", async () => {
    // Mock axios.post to simulate successful form submission

    mockConfig.renderComponent();
    const submitButton = screen.getByTestId(mockConfig.testIds.submitButton);

    fireEvent.change(screen.getByTestId(mockConfig.testIds.companyInput), {
      target: { value: mockConfig.mockValues.company },
    });
    fireEvent.change(screen.getByTestId(mockConfig.testIds.emailInput), {
      target: { value: mockConfig.mockValues.email },
    });
    fireEvent.change(screen.getByTestId(mockConfig.testIds.fullNameInput), {
      target: { value: mockConfig.mockValues.fullName },
    });
    fireEvent.change(screen.getByTestId(mockConfig.testIds.messageInput), {
      target: { value: mockConfig.mockValues.message },
    });

    const budgetRadioList = screen.getByTestId(
      mockConfig.testIds.budgetRadioContainer
    );
    expect(budgetRadioList).toBeInTheDocument();

    const budgetRadio = screen.getByTestId(mockConfig.testIds.budgetRadio);
    fireEvent.click(budgetRadio);

    // Change other required fields

    fireEvent.click(submitButton);

    // Assert that the form is submitted
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/send-mail", {
        values: {
          company: mockConfig.mockValues.company,
          email: mockConfig.mockValues.email,
          full_name: mockConfig.mockValues.fullName,
          message: mockConfig.mockValues.message,
          budget: mockConfig.mockValues.budget,
        },
      });
      hasSnackbar("success", mockConfig.response.success.message);
    });
  });
});
