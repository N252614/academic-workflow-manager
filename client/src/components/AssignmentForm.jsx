function AssignmentForm({
  studentId,
  setStudentId,
  status,
  setStatus,
  onSubmit,
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="number"
        placeholder="Enter student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        style={{
          padding: "6px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginRight: "10px",
        }}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{
          padding: "6px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginRight: "10px",
        }}
      >
        <option value="submitted">submitted</option>
        <option value="graded">graded</option>
        <option value="missing">missing</option>
      </select>

      <button
        onClick={onSubmit}
        style={blueBtn}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#1e4e8c")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#2b6cb0")}
      >
        Add Submission
      </button>
    </div>
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

export default AssignmentForm;