import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Auth from "@/app/auth/page";
import { signIn } from "next-auth/react";
import SnackbarContextProvider from "@/context/SnackbarContext";
import { hasSnackbar } from "../components/Contact/contact.test";
import Snackbar from "@/components/Snackbar";

const mockConfig = {
  renderComponent: () =>
    render(
      <SnackbarContextProvider>
        <>
          <Auth />
          <Snackbar />
        </>
      </SnackbarContextProvider>
    ),
  title: "Join Waitlist",
  testIds: {
    emailInput: "email",
    passwordInput: "password",
    submitButtonLabel: "Sign In",
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

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock signIn function
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(() => ({ error: "Invalid credentials" })),
}));

describe("Login Page", () => {
  it("renders login form correctly", () => {
    mockConfig.renderComponent();

    // Add assertions to verify the presence of form fields, submit button, etc.
    expect(
      screen.getByTestId(mockConfig.testIds.emailInput)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(mockConfig.testIds.passwordInput)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(mockConfig.testIds.submitButtonLabel)
    ).toBeInTheDocument();
    // Add more assertions as needed
  });

  it("handles user input correctly", () => {
    mockConfig.renderComponent();

    const emailInput = screen.getByTestId(mockConfig.testIds.emailInput);
    const passwordInput = screen.getByTestId(mockConfig.testIds.passwordInput);

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Add assertions to verify that input values are updated
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
    // Add more assertions as needed
  });

  it("submits the form with valid credentials", async () => {
    mockConfig.renderComponent();

    const emailInput = screen.getByTestId(mockConfig.testIds.emailInput);
    const passwordInput = screen.getByTestId(mockConfig.testIds.passwordInput);
    const submitButton = screen.getByTestId(
      mockConfig.testIds.submitButtonLabel
    );

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Add assertions to verify that signIn function is called with correct arguments
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        callbackUrl: "/",
        redirect: false,
      });
    });
    // Add more assertions as needed
  });

  it("displays error message for invalid credentials", async () => {
    // Mock signIn function to return an error
    // signIn.mockImplementation(() => ({ error: "Invalid credentials" }));

    mockConfig.renderComponent();

    const emailInput = screen.getByTestId(mockConfig.testIds.emailInput);
    const passwordInput = screen.getByTestId(mockConfig.testIds.passwordInput);
    const submitButton = screen.getByTestId(
      mockConfig.testIds.submitButtonLabel
    );

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    // Add assertions to verify that error message is displayed
    await waitFor(() => {
      // expect(screen.getByTestId("snackbar-container")).toBeInTheDocument();
      hasSnackbar("error", "Email/password combination is incorrect");
    });
    // hasSnackbar("success", mockConfig.response.success.message);
    // Add more assertions as needed
  });

  // Add more test cases as needed
});
