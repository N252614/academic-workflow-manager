import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function CoursePage() {
  // Get course id from URL
  const { id } = useParams();

  // State for one selected course
  const [course, setCourse] = useState(null);

  // State for all courses
  const [courses, setCourses] = useState([]);

  // State for assignments in selected course
  const [assignments, setAssignments] = useState([]);

  // State for new course input
  const [newCourseTitle, setNewCourseTitle] = useState("");

  // State for new assignment input
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");

  // Fetch data when page loads or id changes
  useEffect(() => {
    // Fetch all courses
    fetch("http://127.0.0.1:5000/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error(err));

    // If there is a course id, fetch one course and its assignments
    if (id) {
      // Fetch selected course
      fetch(`http://127.0.0.1:5000/courses/${id}`)
        .then((res) => res.json())
        .then((data) => setCourse(data))
        .catch((err) => console.error(err));

      // Fetch assignments for selected course
      fetch(`http://127.0.0.1:5000/courses/${id}/assignments`)
        .then((res) => res.json())
        .then((data) => setAssignments(data))
        .catch((err) => console.error(err));
    } else {
      // Clear selected course data on /course page
      setCourse(null);
      setAssignments([]);
    }
  }, [id]);

  // Add a new course
  function addCourse() {
    if (!newCourseTitle.trim()) return;

    fetch("http://127.0.0.1:5000/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newCourseTitle,
        teacher_id: 1,
      }),
    })
      .then((res) => res.json())
      .then((newCourse) => {
        // Update courses list
        setCourses((prev) => [...prev, newCourse]);

        // Clear input field
        setNewCourseTitle("");
      })
      .catch((err) => console.error(err));
  }

  // Delete a course
  function deleteCourse(courseId) {
    fetch(`http://127.0.0.1:5000/courses/${courseId}`, {
      method: "DELETE",
    })
      .then(() => {
        // Remove deleted course from state
        setCourses((prev) =>
          prev.filter((courseItem) => courseItem.id !== courseId)
        );

        // Clear selected course if it was deleted
        if (String(courseId) === String(id)) {
          setCourse(null);
          setAssignments([]);
        }
      })
      .catch((err) => console.error(err));
  }

  // Add a new assignment
  function addAssignment() {
    if (!newAssignmentTitle.trim()) return;
    if (!id) return;

    fetch("http://127.0.0.1:5000/assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newAssignmentTitle,
        course_id: Number(id),
      }),
    })
      .then((res) => res.json())
      .then((newAssignment) => {
        // Update assignments list
        setAssignments((prev) => [...prev, newAssignment]);

        // Clear input field
        setNewAssignmentTitle("");
      })
      .catch((err) => console.error(err));
  }

  // Delete one assignment
  function deleteAssignment(assignmentId) {
    fetch(`http://127.0.0.1:5000/assignments/${assignmentId}`, {
      method: "DELETE",
    })
      .then(() => {
        // Remove deleted assignment from state
        setAssignments((prev) =>
          prev.filter((assignment) => assignment.id !== assignmentId)
        );
      })
      .catch((err) => console.error(err));
  }

  return (
    <div style={{ textAlign: "center" }}>
      {/* Show one course page */}
      {id ? (
        <>
          <h1>Course Details</h1>

          {/* Show selected course title */}
          {course ? <h2>{course.title}</h2> : <p>Loading...</p>}

          {/* Assignment section */}
          <h3>Assignments</h3>

          {/* Input for new assignment */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Enter assignment title"
              value={newAssignmentTitle}
              onChange={(e) => setNewAssignmentTitle(e.target.value)}
              style={{ marginRight: "10px" }}
            />
            <button onClick={addAssignment}>Add Assignment</button>
          </div>

          {/* Show assignments list */}
         <AssignmentList
           assignments={assignments}
           onDelete={deleteAssignment}
         
        />
      </>
      ) : (
        <>
          {/* Show all courses page */}
          <h1>Courses</h1>

          {/* Input for new course */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Enter course title"
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              style={{ marginRight: "10px" }}
            />
            <button onClick={addCourse}>Add Course</button>
          </div>

          {/* Show courses list */}
          {courses.length === 0 ? (
            <p>No courses yet</p>
          ) : (
            <ul style={{ listStylePosition: "inside" }}>
              {courses.map((courseItem) => (
                <li key={courseItem.id}>
                  {/* Link to course details page */}
                  <Link to={`/course/${courseItem.id}`}>
                    {courseItem.title}
                  </Link>

                  {/* Delete course button */}
                  <button
                    onClick={() => deleteCourse(courseItem.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default CoursePage;