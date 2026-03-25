import { Link } from "react-router-dom";

function AssignmentList({ assignments, onDelete }) {
  if (assignments.length === 0) {
    return <p>No assignments yet</p>;
  }

  return (
    <ul style={{ listStylePosition: "inside" }}>
      {assignments.map((assignment) => (
        <li key={assignment.id}>
          <Link to={`/assignments/${assignment.id}`}>
            {assignment.title}
          </Link>

          <button
            onClick={() => onDelete(assignment.id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default AssignmentList;