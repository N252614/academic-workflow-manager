import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import SubmissionList from "../components/SubmissionList";
import AssignmentForm from "../components/AssignmentForm";
import heroImage from "../assets/dashboard-bg.png";

// Base URL for backend API through Vite proxy
const API_URL = "/api";

function AssignmentDetailsPage() {
  // Get assignment id from URL
  const { id } = useParams();

  // State for assignment data
  const [assignment, setAssignment] = useState(null);

  // State for submissions list
  const [submissions, setSubmissions] = useState([]);

  // State for new submission inputs
  const [studentId, setStudentId] = useState("");
  const [status, setStatus] = useState("submitted");

  // State for loading
  const [loading, setLoading] = useState(true);

  // State for error
  const [error, setError] = useState("");

  // State for AI suggestion
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Fetch assignment and submissions when page loads
  useEffect(() => {
    setLoading(true);
    setError("");

    Promise.all([
      fetch(`${API_URL}/assignments/${id}`, {
        credentials: "include",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Assignment not found");
        }
        return res.json();
      }),

      fetch(`${API_URL}/submissions`, {
        credentials: "include",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Could not load submissions");
        }
        return res.json();
      }),
    ])
      .then(([assignmentData, submissionsData]) => {
        // Keep only submissions for the current assignment
        const filtered = submissionsData.filter(
          (sub) => sub.assignment_id === Number(id)
        );

        setAssignment(assignmentData);
        setSubmissions(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load assignment details");
        setLoading(false);
      });
  }, [id]);

  // Add new submission
  function addSubmission() {
    if (!studentId.trim()) return;

    fetch(`${API_URL}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        status,
        assignment_id: Number(id),
        student_id: Number(studentId),
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Could not add submission");
        }

        return data;
      })
      .then((newSubmission) => {
        // Add new submission to local state
        setSubmissions((prev) => [...prev, newSubmission]);
        setStudentId("");
        setStatus("submitted");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }

  // Delete submission
  function deleteSubmission(submissionId) {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this submission?"
    );

    if (!isConfirmed) return;

    fetch(`${API_URL}/submissions/${submissionId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Could not delete submission");
        }

        return data;
      })
      .then(() => {
        setSubmissions((prev) =>
          prev.filter((sub) => sub.id !== submissionId)
        );
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }

  // Generate AI suggestion for the current assignment
  function generateAiSuggestion() {
    if (!assignment) return;

    setLoadingAi(true);
    setAiSuggestion("");

    fetch(`${API_URL}/ai/suggestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        assignment_title: assignment.title,
        submission_count: submissions.length,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Could not generate AI suggestion");
        }

        return data;
      })
      .then((data) => {
        setAiSuggestion(data.suggestion);
        setLoadingAi(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoadingAi(false);
      });
  }

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        color: "#222",
      }}
    >
      <div
        style={{
          textAlign: "center",
          backgroundColor: "rgba(255, 255, 255, 0.94)",
          padding: "30px",
          borderRadius: "14px",
          width: "700px",
          maxWidth: "95%",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
            fontSize: "40px",
            fontWeight: "600",
            letterSpacing: "0.5px",
          }}
        >
          Assignment Details
        </h1>

        <p
          style={{
            color: "#2b6cb0",
            fontSize: "18px",
            marginBottom: "24px",
            fontWeight: "500",
          }}
        >
          Review submissions and generate AI suggestions
        </p>

        {/* Show assignment title */}
        <h2>{assignment.title}</h2>

        {/* AI suggestion section */}
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <button
            onClick={generateAiSuggestion}
            disabled={loadingAi}
            style={{
              ...blueBtn,
              opacity: loadingAi ? 0.7 : 1,
              cursor: loadingAi ? "not-allowed" : "pointer",
            }}
          >
            {loadingAi ? "Generating..." : "Generate AI Suggestion"}
          </button>

          {aiSuggestion && (
            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                maxWidth: "600px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <strong>AI Suggestion:</strong>
              <p>{aiSuggestion}</p>
            </div>
          )}
        </div>

        <h3>Submissions</h3>

        {/* Form to add a new submission */}
        <AssignmentForm
          studentId={studentId}
          setStudentId={setStudentId}
          status={status}
          setStatus={setStatus}
          onSubmit={addSubmission}
        />

        {/* Show submissions list */}
        <SubmissionList
          submissions={submissions}
          onDelete={deleteSubmission}
        />
      </div>
    </div>
  );
}

const blueBtn = {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#2b6cb0",
  color: "white",
  cursor: "pointer",
};

export default AssignmentDetailsPage;