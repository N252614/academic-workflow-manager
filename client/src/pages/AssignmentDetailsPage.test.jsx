// Import testing utilities from React Testing Library
import { render, screen, waitFor } from "@testing-library/react";

// Import router tools because this page uses route params (assignment ID)
import { MemoryRouter, Routes, Route } from "react-router-dom";

// Import the component we are testing
import AssignmentDetailsPage from "./AssignmentDetailsPage";

// Mock fetch before each test
beforeEach(() => {
  global.fetch = vi.fn((url) => {
    // Mock API response for assignment details
    if (url.includes("/assignments/1")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            title: "Homework new",
            course_id: 3,
          }),
      });
    }

    // Mock API response for submissions list
    if (url.includes("/submissions")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              status: "submitted",
              assignment_id: 1,
              student_id: 4,
            },
            {
              id: 2,
              status: "graded",
              assignment_id: 1,
              student_id: 5,
            },
          ]),
      });
    }

    // Default fallback response
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });
});

// Restore original functions after each test
afterEach(() => {
  vi.restoreAllMocks();
});

// Group all tests for AssignmentDetailsPage
describe("AssignmentDetailsPage", () => {
  // Helper function to render component with route param
  function renderAssignmentPage() {
    render(
      <MemoryRouter initialEntries={["/assignments/1"]}>
        <Routes>
          <Route path="/assignments/:id" element={<AssignmentDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );
  }

  // Test 1: Check if page heading renders correctly
  it("should render assignment details heading when component loads", async () => {
    renderAssignmentPage();

    // Find heading element
    const heading = await screen.findByRole("heading", {
      name: /assignment details/i,
    });

    // Verify heading exists
    expect(heading).toBeInTheDocument();
  });

  // Test 2: Check if AI suggestion button is displayed
  it("should display generate ai suggestion button when component loads", async () => {
    renderAssignmentPage();

    // Find button
    const button = await screen.findByRole("button", {
      name: /generate ai suggestion/i,
    });

    // Verify button exists
    expect(button).toBeInTheDocument();
  });

  // Test 3: Check if "Add Submission" button is displayed
  it("should display add submission button when component loads", async () => {
    renderAssignmentPage();

    // Wait until button appears after data loads
    await waitFor(() => {
      const button = screen.getByRole("button", {
        name: /add submission/i,
      });

      expect(button).toBeInTheDocument();
    });
  });

  // Test 4: Check if submissions list is displayed
  it("should display submissions list when data is loaded", async () => {
    renderAssignmentPage();

    // Find all submission items that contain "Student ID"
    const submissions = await screen.findAllByText(/student id/i);

    // Verify that submission items are rendered
    expect(submissions.length).toBeGreaterThan(0);
  });
});