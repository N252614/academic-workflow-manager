import { useState } from "react";
import SubmissionStatus from "./SubmissionStatus";

function SubmissionList({ submissions, onDelete }) {
  // State for editing one submission
  const [editingSubmissionId, setEditingSubmissionId] = useState(null);

  // State for edited submission status
  const [editedStatus, setEditedStatus] = useState("");

  // Start editing a submission
  function startEdit(submission) {
    setEditingSubmissionId(submission.id);
    setEditedStatus(submission.status);
  }

  // Cancel editing
  function cancelEdit() {
    setEditingSubmissionId(null);
    setEditedStatus("");
  }

  // Save updated submission status
  function saveEdit(submissionId) {
    if (!editedStatus.trim()) return;

    fetch(`http://127.0.0.1:5000/submissions/${submissionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: editedStatus,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not update submission");
        }
        return res.json();
      })
      .then(() => {
        // Reload page so updated status appears
        window.location.reload();
      })
      .catch((err) => console.error(err));
  }

  if (submissions.length === 0) {
    return <p>No submissions yet</p>;
  }

  return (
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {submissions.map((sub) => (
        <li
          key={sub.id}
          style={{
            marginBottom: "12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {editingSubmissionId === sub.id ? (
            <>
              <select
                value={editedStatus}
                onChange={(e) => setEditedStatus(e.target.value)}
                style={{
                  padding: "6px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="submitted">submitted</option>
                <option value="graded">graded</option>
                <option value="missing">missing</option>
              </select>

              <button
                onClick={() => saveEdit(sub.id)}
                style={blueBtn}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#1e4e8c")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#2b6cb0")
                }
              >
                Save
              </button>

              <button
                onClick={cancelEdit}
                style={grayBtn}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#e2e2e2")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#f5f5f5")
                }
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span>
                <SubmissionStatus status={sub.status} /> | Student ID:{" "}
                {sub.student_id}
              </span>

              <button
                onClick={() => startEdit(sub)}
                style={grayBtn}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#e2e2e2")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#f5f5f5")
                }
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(sub.id)}
                style={redBtn}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#c53030")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#e53e3e")
                }
              >
                Delete
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

const blueBtn = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#2b6cb0",
  color: "white",
  cursor: "pointer",
};

const grayBtn = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  backgroundColor: "#f5f5f5",
  cursor: "pointer",
};

const redBtn = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#e53e3e",
  color: "white",
  cursor: "pointer",
};

export default SubmissionList;