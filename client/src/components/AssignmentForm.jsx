function AssignmentForm({ studentId, setStudentId, status, setStatus, onSubmit }) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <input
        type="number"
        placeholder="Enter student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{ marginRight: "10px" }}
      >
        <option value="submitted">submitted</option>
        <option value="graded">graded</option>
        <option value="missing">missing</option>
      </select>

      <button onClick={onSubmit}>Add Submission</button>
    </div>
  );
}

export default AssignmentForm;