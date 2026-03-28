import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AssignmentList from "../components/AssignmentList";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import heroImage from "../assets/dashboard-bg.png";

// Base URL for backend API through Vite proxy
const API_URL = "/api";

function CoursePage() {
  // Get course id from URL
  const { id } = useParams();

  // State for one selected course
  const [course, setCourse] = useState(null);

  // State for all courses
  const [courses, setCourses] = useState([]);

  // Pagination state for courses page
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State for assignments in selected course
  const [assignments, setAssignments] = useState([]);

  // State for new course input
  const [newCourseTitle, setNewCourseTitle] = useState("");

  // State for editing course
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editedCourseTitle, setEditedCourseTitle] = useState("");

  // State for new assignment input
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");

  // State for loading
  const [loading, setLoading] = useState(true);

  // State for error
  const [error, setError] = useState("");

  // Fetch data when page loads or id changes
  useEffect(() => {
    setLoading(true);
    setError("");

    // If there is an id, load one course and its assignments
    if (id) {
      Promise.all([
        fetch(`${API_URL}/courses/${id}`, {
          credentials: "include",
        }).then((res) => {
          if (!res.ok) {
            throw new Error("Could not load course");
          }
          return res.json();
        }),

        fetch(`${API_URL}/courses/${id}/assignments`, {
          credentials: "include",
        }).then((res) => {
          if (!res.ok) {
            throw new Error("Could not load assignments");
          }
          return res.json();
        }),
      ])
        .then(([courseData, assignmentsData]) => {
          setCourse(courseData);
          setAssignments(assignmentsData);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Could not load course details");
          setLoading(false);
        });
    } else {
      // Otherwise load paginated courses list
      fetch(`${API_URL}/courses?page=${page}&per_page=5`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Could not load courses");
          }
          return res.json();
        })
        .then((data) => {
          setCourses(data.items || []);
          setTotalPages(data.pages || 1);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Could not load courses");
          setLoading(false);
        });
    }
  }, [id, page]);

  // Add a new course
  function addCourse() {
    if (!newCourseTitle.trim()) return;

    fetch(`${API_URL}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: newCourseTitle,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Could not add course");
        }

        return data;
      })
      .then(() => {
        setNewCourseTitle("");

        // Reload current page after creating a course
        return fetch(`${API_URL}/courses?page=${page}&per_page=5`, {
          credentials: "include",
        });
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not reload courses");
        }
        return res.json();
      })
      .then((data) => {
        setCourses(data.items || []);
        setTotalPages(data.pages || 1);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }

  // Delete a course
  function deleteCourse(courseId) {
    fetch(`${API_URL}/courses/${courseId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Could not delete course");
        }

        return data;
      })
      .then(() => {
        // Remove deleted course from current page
        setCourses((prev) =>
          prev.filter((courseItem) => courseItem.id !== courseId)
        );

        // Clear selected course if it was deleted
        if (String(courseId) === String(id)) {
          setCourse(null);
          setAssignments([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }

  // Start editing a course
  function startEditCourse(courseItem) {
    setEditingCourseId(courseItem.id);
    setEditedCourseTitle(courseItem.title);
  }

  // Cancel editing a course
  function cancelEditCourse() {
    setEditingCourseId(null);
    setEditedCourseTitle("");
  }

  // Save edited course
  function saveCourse(courseId) {
    if (!editedCourseTitle.trim()) return;

    fetch(`${API_URL}/courses/${courseId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: editedCourseTitle,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Could not update course");
        }

        return data;
      })
      .then((updatedCourse) => {
        setCourses((prev) =>
          prev.map((courseItem) =>
            courseItem.id === courseId ? updatedCourse : courseItem
          )
        );

        if (course && course.id === courseId) {
          setCourse(updatedCourse);
        }

        setEditingCourseId(null);
        setEditedCourseTitle("");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }

  // Add a new assignment
  function addAssignment() {
    if (!newAssignmentTitle.trim()) return;
    if (!id) return;

    fetch(`${API_URL}/assignments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: newAssignmentTitle,
        course_id: Number(id),
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Could not add assignment");
        }

        return data;
      })
      .then((newAssignment) => {
        setAssignments((prev) => [...prev, newAssignment]);
        setNewAssignmentTitle("");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }

  // Delete one assignment
  function deleteAssignment(assignmentId) {
    fetch(`${API_URL}/assignments/${assignmentId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Could not delete assignment");
        }

        return data;
      })
      .then(() => {
        setAssignments((prev) =>
          prev.filter((assignment) => assignment.id !== assignmentId)
        );
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        color: "#222",
      }}
    >
      <div
        style={{
          textAlign: "center",
          backgroundColor: "rgba(255, 255, 255, 0.94)",
          padding: "30px",
          borderRadius: "14px",
          width: "700px",
          maxWidth: "95%",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
        }}
      >
        {id ? (
          <>
            {/* Page title */}
            <h1
              style={{
                marginBottom: "10px",
                fontSize: "40px",
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}
            >
              Course Details
            </h1>

            {/* Page subtitle */}
            <p
              style={{
                color: "#2b6cb0",
                fontSize: "18px",
                marginBottom: "24px",
                fontWeight: "500",
              }}
            >
              Manage assignments inside this course
            </p>

            {/* Selected course title */}
            {course ? <h2>{course.title}</h2> : <p>No course found</p>}

            <h3>Assignments</h3>

            {/* Input for new assignment */}
            <div style={{ marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Enter assignment title"
                value={newAssignmentTitle}
                onChange={(e) => setNewAssignmentTitle(e.target.value)}
                style={{
                  padding: "6px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginRight: "10px",
                }}
              />
              <button
                onClick={addAssignment}
                style={blueBtn}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#1e4e8c")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#2b6cb0")
                }
              >
                Add Assignment
              </button>
            </div>

            {/* Show assignments list */}
            <AssignmentList
              assignments={assignments}
              onDelete={deleteAssignment}
            />
          </>
        ) : (
          <>
            {/* Page title */}
            <h1
              style={{
                marginBottom: "10px",
                fontSize: "40px",
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}
            >
              Courses
            </h1>

            {/* Page subtitle */}
            <p
              style={{
                color: "#2b6cb0",
                fontSize: "18px",
                marginBottom: "24px",
                fontWeight: "500",
              }}
            >
              Create, edit, and organize your course list
            </p>

            {/* Input for new course */}
            <div style={{ marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Enter course title"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                style={{
                  padding: "6px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginRight: "10px",
                }}
              />
              <button
                onClick={addCourse}
                style={blueBtn}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#1e4e8c")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#2b6cb0")
                }
              >
                Add Course
              </button>
            </div>

            {/* Show courses list */}
            {courses.length === 0 ? (
              <p>No courses yet</p>
            ) : (
              <ul style={{ listStylePosition: "inside", padding: 0 }}>
                {courses.map((courseItem) => (
                  <li key={courseItem.id} style={{ marginBottom: "12px" }}>
                    {editingCourseId === courseItem.id ? (
                      <>
                        <input
                          type="text"
                          value={editedCourseTitle}
                          onChange={(e) => setEditedCourseTitle(e.target.value)}
                          style={{
                            padding: "6px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            marginRight: "10px",
                          }}
                        />
                        <button
                          onClick={() => saveCourse(courseItem.id)}
                          style={{ ...blueBtn, marginRight: "10px" }}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#1e4e8c")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#2b6cb0")
                          }
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditCourse}
                          style={grayBtn}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#e2e2e2")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#f5f5f5")
                          }
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to={`/course/${courseItem.id}`}>
                          {courseItem.title}
                        </Link>
                        <button
                          onClick={() => startEditCourse(courseItem)}
                          style={{
                            ...grayBtn,
                            marginLeft: "10px",
                            marginRight: "10px",
                          }}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#e2e2e2")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#f5f5f5")
                          }
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCourse(courseItem.id)}
                          style={redBtn}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#c53030")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#e53e3e")
                          }
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Pagination controls */}
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                style={{
                  ...grayBtn,
                  marginRight: "10px",
                  opacity: page === 1 ? 0.7 : 1,
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  color: "#666",
                }}
              >
                Prev
              </button>

              <span style={{ margin: "0 10px", fontWeight: "500" }}>
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                style={{
                  ...grayBtn,
                  marginLeft: "10px",
                  opacity: page === totalPages ? 0.7 : 1,
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  color: "#666",
                }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
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

const grayBtn = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  backgroundColor: "#f5f5f5",
  cursor: "pointer",
};

const redBtn = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#e53e3e",
  color: "white",
  cursor: "pointer",
};

export default CoursePage;