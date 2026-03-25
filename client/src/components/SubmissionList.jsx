import SubmissionStatus from "./SubmissionStatus";
function SubmissionList({ submissions, onDelete }) {
  if (submissions.length === 0) {
    return <p>No submissions yet</p>;
  }

  return (
    <ul style={{ listStylePosition: "inside" }}>
      {submissions.map((sub) => (
        <li key={sub.id}>
         <SubmissionStatus status={sub.status} /> | Student ID: {sub.student_id}

          <button
            onClick={() => onDelete(sub.id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default SubmissionList;