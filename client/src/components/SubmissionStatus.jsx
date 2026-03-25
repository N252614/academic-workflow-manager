function SubmissionStatus({ status }) {
  let color = "black";

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