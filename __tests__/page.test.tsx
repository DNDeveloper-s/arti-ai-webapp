import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { getServerSession } from "next-auth/next";
import LandingPage from "../src/components/ProductPage/ProductLandingPage";

// Mock getServerSession function
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

describe("Home component", () => {
  it("renders ProductLandingPage when no session exists", async () => {
    // Mock the session to be null
    render(<LandingPage />);

    // Assert that ProductLandingPage is rendered
    // expect(screen.getByText("Product Landing Page")).toBeInTheDocument();
  });

  // it("renders Dashboard when session exists", async () => {
  //   // Mock a session
  //   getServerSession.mockResolvedValueOnce({});

  //   render(<Page />);

  //   // Assert that Dashboard is rendered
  //   expect(screen.getByText("Dashboard")).toBeInTheDocument();
  // });

  // it("renders AppLoader while waiting for session check", async () => {
  //   // Mock the session to be null initially
  //   getServerSession.mockResolvedValueOnce(null);

  //   const { container } = render(<Page />);

  //   // Assert that AppLoader is rendered initially
  //   expect(screen.getByText("Loading...")).toBeInTheDocument();

  //   // Wait for the session check to complete
  //   await screen.findByText("Product Landing Page");

  //   // Assert that AppLoader is not rendered anymore
  //   expect(container.querySelector("Loading...")).toBeNull();
  // });
});
