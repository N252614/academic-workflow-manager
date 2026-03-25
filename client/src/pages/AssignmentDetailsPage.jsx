import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import SubmissionList from "../components/SubmissionList";
import AssignmentForm from "../components/AssignmentForm";

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

  // Fetch assignment and submissions when page loads
  useEffect(() => {
    Promise.all([
      fetch(`http://127.0.0.1:5000/assignments/${id}`).then((res) => {
        if (!res.ok) {
          throw new Error("Assignment not found");
        }
        return res.json();
      }),
      fetch(`http://127.0.0.1:5000/submissions`).then((res) => {
        if (!res.ok) {
          throw new Error("Could not load submissions");
        }
        return res.json();
      }),
    ])
      .then(([assignmentData, submissionsData]) => {
        // Save fetched data in state
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
    // Prevent empty student id
    if (!studentId.trim()) return;

    fetch("http://127.0.0.1:5000/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status,
        assignment_id: Number(id),
        student_id: Number(studentId),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not add submission");
        }
        return res.json();
      })
      .then((newSubmission) => {
        // Add new submission to the list
        setSubmissions((prev) => [...prev, newSubmission]);

        // Clear input fields
        setStudentId("");
        setStatus("submitted");
      })
      .catch((err) => console.error(err));
  }

  // Delete submission
  function deleteSubmission(submissionId) {
    // Ask user before delete
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this submission?"
    );

    // Stop if user clicks Cancel
    if (!isConfirmed) return;

    fetch(`http://127.0.0.1:5000/submissions/${submissionId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Delete failed");
        }

        // Remove deleted submission from UI
        setSubmissions((prev) =>
          prev.filter((sub) => sub.id !== submissionId)
        );
      })
      .catch((err) => console.error(err));
  }

  // Show loading message
  if (loading) return <LoadingIndicator />;

  // Show error message
  if (error) return <ErrorMessage message="Could not load assignment details" />

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Assignment Details</h1>

      {/* Show assignment title */}
      <h2>{assignment.title}</h2>

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
  );
}

export default AssignmentDetailsPage;