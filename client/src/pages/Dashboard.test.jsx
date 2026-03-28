// Import testing utilities from React Testing Library
import { render, screen } from "@testing-library/react";

// Import the component we want to test
import Dashboard from "./Dashboard";

// Import BrowserRouter because Dashboard uses routing
import { BrowserRouter } from "react-router-dom";

// Group of tests for Dashboard component
describe("Dashboard", () => {

  // Test 1: check if the main title is rendered
  it("should render dashboard title when component loads", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const title = screen.getByText(/dashboard/i);
    expect(title).toBeInTheDocument();
  });

  // Test 2: check if Account section is visible
  it("should display account section when dashboard loads", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const accountSection = screen.getByText(/account/i);
    expect(accountSection).toBeInTheDocument();
  });

  // Test 3: check not logged in message
  it("should show not logged in message when user is not authenticated", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const message = screen.getByText(/not logged in/i);
    expect(message).toBeInTheDocument();
  });

  // Test 4: check login and signup buttons
  it("should display login and signup buttons when user is not authenticated", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const loginButton = screen.getByRole("button", { name: /log in/i });
    const signupButton = screen.getByRole("button", { name: /sign up/i });

    expect(loginButton).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
  });

  // Test 5: basic interaction (click login button)
  it("should allow user to click login button", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const loginButton = screen.getByRole("button", { name: /log in/i });

    // Simulate click
    loginButton.click();

    // Verify button still exists after click
    expect(loginButton).toBeInTheDocument();
  });

});