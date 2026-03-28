import { Link } from "react-router-dom";
import { useState } from "react";

function AssignmentList({ assignments, onDelete }) {
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  function startEdit(assignment) {
    setEditingAssignmentId(assignment.id);
    setEditedTitle(assignment.title);
  }

  function cancelEdit() {
    setEditingAssignmentId(null);
    setEditedTitle("");
  }

  function saveEdit(assignmentId) {
    if (!editedTitle.trim()) return;

    fetch(`http://127.0.0.1:5000/assignments/${assignmentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editedTitle,
      }),
    })
      .then((res) => res.json())
      .then(() => window.location.reload())
      .catch((err) => console.error(err));
  }

  return (
    <div>
      {assignments.length === 0 ? (
        <p>No assignments yet</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {assignments.map((assignment) => (
            <li key={assignment.id} style={{ marginBottom: "12px" }}>
              {editingAssignmentId === assignment.id ? (
                <>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />

                  {/* Save (blue) */}
                  <button
                    onClick={() => saveEdit(assignment.id)}
                    style={blueBtn}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#1e4e8c")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#2b6cb0")}
                  >
                    Save
                  </button>

                  {/* Cancel (gray) */}
                  <button
                    onClick={cancelEdit}
                    style={grayBtn}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#e2e2e2")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <Link to={`/assignments/${assignment.id}`}>
                    {assignment.title}
                  </Link>

                  {/* Edit */}
                  <button
                    onClick={() => startEdit(assignment)}
                    style={grayBtn}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#e2e2e2")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
                  >
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDelete(assignment.id)}
                    style={redBtn}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#c53030")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#e53e3e")}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Button styles
const blueBtn = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#2b6cb0",
  color: "white",
  cursor: "pointer",
  marginLeft: "8px",
};

const grayBtn = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  backgroundColor: "#f5f5f5",
  cursor: "pointer",
  marginLeft: "8px",
};

const redBtn = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#e53e3e",
  color: "white",
  cursor: "pointer",
  marginLeft: "8px",
};

export default AssignmentList;