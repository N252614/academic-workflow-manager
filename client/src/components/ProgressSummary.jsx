function ProgressSummary({ totalCourses, totalAssignments, totalSubmissions }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Progress Summary</h2>
      <p>Total Courses: {totalCourses}</p>
      <p>Total Assignments: {totalAssignments}</p>
      <p>Total Submissions: {totalSubmissions}</p>
    </div>
  );
}

export default ProgressSummary;