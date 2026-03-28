// Import testing tools
import { render, screen, waitFor } from "@testing-library/react";

// Import router because the page uses React Router
import { BrowserRouter } from "react-router-dom";

// Import the component to test
import CoursePage from "./CoursePage";

// Mock fetch before each test
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          items: [],
          page: 1,
          per_page: 5,
          total: 0,
          pages: 1,
        }),
    })
  );
});

// Clear mocks after each test
afterEach(() => {
  vi.restoreAllMocks();
});

// Group tests for CoursePage
describe("CoursePage", () => {
  // Test 1: check page heading
  it("should render courses heading when component loads", async () => {
    render(
      <BrowserRouter>
        <CoursePage />
      </BrowserRouter>
    );

    // Wait for heading to appear
    const title = await screen.findByRole("heading", { name: /courses/i });

    // Verify heading exists
    expect(title).toBeInTheDocument();
  });

  // Test 2: check input field
  it("should display input field when component loads", async () => {
    render(
      <BrowserRouter>
        <CoursePage />
      </BrowserRouter>
    );

    // Wait until input appears after data loading
    await waitFor(() => {
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });
  });

  // Test 3: check add course button
  it("should display add course button when component loads", async () => {
    render(
      <BrowserRouter>
        <CoursePage />
      </BrowserRouter>
    );

    // Wait until button appears after component updates
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /add course/i });
      expect(button).toBeInTheDocument();
    });
  });
});