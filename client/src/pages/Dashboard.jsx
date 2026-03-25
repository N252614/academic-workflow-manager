// Import React hooks
import { useEffect, useState } from "react";

// Import components (IMPORTANT: no .jsx extension)
import ProgressSummary from "../components/ProgressSummary";
import AlertBanner from "../components/AlertBanner";
import ErrorMessage from "../components/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";

function Dashboard() {

  // State for main data
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // State for loading and error
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data when component loads
  
  useEffect(() => {
    Promise.all([
      // Fetch courses
      fetch("http://127.0.0.1:5000/courses").then((res) => {
        if (!res.ok) {
          throw new Error("Could not load courses");
        }
        return res.json();
      }),

      // Fetch assignments
      fetch("http://127.0.0.1:5000/assignments").then((res) => {
        if (!res.ok) {
          throw new Error("Could not load assignments");
        }
        return res.json();
      }),

      // Fetch submissions
      fetch("http://127.0.0.1:5000/submissions").then((res) => {
        if (!res.ok) {
          throw new Error("Could not load submissions");
        }
        return res.json();
      }),
    ])
      .then(([coursesData, assignmentsData, submissionsData]) => {
        // Save data into state
        setCourses(coursesData);
        setAssignments(assignmentsData);
        setSubmissions(submissionsData);

        // Stop loading
        setLoading(false);
      })
      .catch((err) => {
        // Handle errors
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Show loading indicator

  if (loading) {
    return <LoadingIndicator />;
  }

  // Show error message
 
  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Render dashboard content

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      {/* Alert banner (optional message) */}
      <AlertBanner message="Welcome to your dashboard!" />

      {/* Summary component */}
      <ProgressSummary
        totalCourses={courses.length}
        totalAssignments={assignments.length}
        totalSubmissions={submissions.length}
      />
    </div>
  );
}

// Export component
export default Dashboard;