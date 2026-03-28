function SubmissionStatus({ status }) {
  // Default color
  let color = "black";

  // Set color based on status
  if (status === "submitted") color = "blue";
  if (status === "graded") color = "green";
  if (status === "missing") color = "red";

  return (
    <span style={{ color, fontWeight: "bold" }}>
      {status}
    </span>
  );
}

export default SubmissionStatus;