// Import router tools
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Import pages
import Dashboard from "./pages/Dashboard";
import CoursePage from "./pages/CoursePage";
import AssignmentDetailsPage from "./pages/AssignmentDetailsPage";

// Main app component
function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        {/* Navigation links */}
        <nav>
          <Link to="/">Dashboard</Link> |{" "}
          <Link to="/course">Course</Link> |{" "}
          <Link to="/assignments/1">Assignment</Link>
        </nav>

        <hr />

        {/* App routes */}
        <Routes>
          {/* Dashboard page */}
          <Route path="/" element={<Dashboard />} />

          {/* Course pages */}
          <Route path="/course" element={<CoursePage />} />
          <Route path="/course/:id" element={<CoursePage />} />

          {/* Assignment page */}
          <Route path="/assignments/:id" element={<AssignmentDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;