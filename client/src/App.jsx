// Import React Router components for navigation
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Import main pages from src/pages
import Dashboard from "./pages/Dashboard";
import CoursePage from "./pages/CoursePage";
import AssignmentDetailsPage from "./pages/AssignmentDetailsPage";

// Main App component
function App() {
  return (
    // Router wraps the entire application and enables navigation
    <Router>
      <div style={{ padding: "20px" }}>
        
        {/* Navigation menu (simple links between pages) */}
        <nav>
          <Link to="/">Dashboard</Link> |{" "}
          <Link to="/course">Course</Link> |{" "}
          <Link to="/assignments/1">Assignment</Link>
        </nav>

        <hr />

        {/* Define application routes */}
        <Routes>
          
          {/* Dashboard page (main page) */}
          <Route path="/" element={<Dashboard />} />

          {/* Course page (list of courses or single course) */}
          <Route path="/course" element={<CoursePage />} />
          <Route path="/course/:id" element={<CoursePage />} />

          {/* Assignment details page */}
          <Route path="/assignments/:id" element={<AssignmentDetailsPage />} />
        
        </Routes>
      </div>
    </Router>
  );
}

// Export App component
export default App;