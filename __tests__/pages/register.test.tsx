import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Auth from "@/app/auth/register/page";
import { signIn } from "next-auth/react";
import SnackbarContextProvider from "@/context/SnackbarContext";
import axios from "axios";
import { hasSnackbar } from "../components/Contact/contact.test";
import Snackbar from "@/components/Snackbar";
import { useRouter } from "next/navigation";

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
  testIds: {
    firstNameInput: "first_name",
    lastNameInput: "last_name",
    emailInput: "email",
    passwordInput: "password",
    submitButtonLabel: "Sign Up",
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
  })),
}));

// Mock signIn function
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(() => ({ error: "Invalid credentials" })),
}));

// Mock axios post
jest.mock("axios", () => ({
  post: jest.fn().mockResolvedValueOnce({
    data: { message: "We will get back to you soon.", ok: true },
  }),
}));

describe("Registration Page", () => {
  //   let useRouterSpy: jest.SpyInstance;
  let mockPush: jest.Mock;
  let firstNameInput: HTMLElement;
  let lastNameInput: HTMLElement;
  let emailInput: HTMLElement;
  let passwordInput: HTMLElement;
  let submitButtonLabel: HTMLElement;
  let unmount: () => void;

  beforeEach(() => {
    // useRouterSpy = jest.spyOn(require("next/navigation"), "useRouter");
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    const { unmount: _unmount } = mockConfig.renderComponent();
    unmount = _unmount;

    firstNameInput = screen.getByTestId(mockConfig.testIds.firstNameInput);
    lastNameInput = screen.getByTestId(mockConfig.testIds.lastNameInput);
    emailInput = screen.getByTestId(mockConfig.testIds.emailInput);
    passwordInput = screen.getByTestId(mockConfig.testIds.passwordInput);
    submitButtonLabel = screen.getByTestId(
      mockConfig.testIds.submitButtonLabel
    );
  });

  afterEach(() => {
    if (unmount) {
      unmount();
    }
  });

  it("renders registration form correctly", () => {
    // mockConfig.renderComponent();

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButtonLabel).toBeInTheDocument();
  });

  it("handles user input correctly", () => {
    // mockConfig.renderComponent();

    fireEvent.change(firstNameInput, {
      target: { value: mockConfig.mockValues.first_name },
    });
    fireEvent.change(lastNameInput, {
      target: { value: mockConfig.mockValues.last_name },
    });
    fireEvent.change(emailInput, {
      target: { value: mockConfig.mockValues.email },
    });
    fireEvent.change(passwordInput, {
      target: { value: mockConfig.mockValues.password },
    });

    expect(firstNameInput).toHaveValue(mockConfig.mockValues.first_name);
    expect(lastNameInput).toHaveValue(mockConfig.mockValues.last_name);
    expect(emailInput).toHaveValue(mockConfig.mockValues.email);
    expect(passwordInput).toHaveValue(mockConfig.mockValues.password);
  });

  it("submits the form with valid credentials", async () => {
    // mockConfig.renderComponent();

    fireEvent.change(firstNameInput, {
      target: { value: mockConfig.mockValues.first_name },
    });
    fireEvent.change(lastNameInput, {
      target: { value: mockConfig.mockValues.last_name },
    });
    fireEvent.change(emailInput, {
      target: { value: mockConfig.mockValues.email },
    });
    fireEvent.change(passwordInput, {
      target: { value: mockConfig.mockValues.password },
    });

    fireEvent.click(submitButtonLabel);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/auth/register", {
        values: mockConfig.mockValues,
      });
      // Add assertions for signIn function call if necessary
    });
  });

  it("displays error message for invalid credentials", async () => {
    // Mock axios post to return an error
    (axios.post as jest.Mock).mockRejectedValue({
      message: "Something went wrong!",
    });

    fireEvent.change(firstNameInput, {
      target: { value: mockConfig.mockValues.first_name },
    });
    fireEvent.change(lastNameInput, {
      target: { value: mockConfig.mockValues.last_name },
    });
    fireEvent.change(emailInput, {
      target: { value: mockConfig.mockValues.email },
    });
    fireEvent.change(passwordInput, {
      target: { value: mockConfig.mockValues.password },
    });

    fireEvent.click(submitButtonLabel);

    await waitFor(() => {
      hasSnackbar("error", "Something went wrong!");
    });
  });

  it('redirects to "/business/register" on successful registration', async () => {
    // mockConfig.renderComponent();

    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { ok: true } });

    (signIn as jest.Mock).mockResolvedValueOnce({});

    fireEvent.change(firstNameInput, {
      target: { value: mockConfig.mockValues.first_name },
    });
    fireEvent.change(lastNameInput, {
      target: { value: mockConfig.mockValues.last_name },
    });
    fireEvent.change(emailInput, {
      target: { value: mockConfig.mockValues.email },
    });
    fireEvent.change(passwordInput, {
      target: { value: mockConfig.mockValues.password },
    });

    fireEvent.click(submitButtonLabel);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        ...mockConfig.mockValues,
        callbackUrl: "/business/register",
        redirect: false,
      });
      expect(mockPush).toHaveBeenCalledWith("/business/register");
    });
  });
});
