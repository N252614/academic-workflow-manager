function ProgressSummary({
  totalCourses,
  totalAssignments,
  totalSubmissions,
}) {
  // Show summary of main data
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Progress Summary</h2>

      {/* Total number of courses */}
      <p>Total Courses: {totalCourses}</p>

      {/* Total number of assignments */}
      <p>Total Assignments: {totalAssignments}</p>

      {/* Total number of submissions */}
      <p>Total Submissions: {totalSubmissions}</p>
    </div>
  );
}

export default ProgressSummary;