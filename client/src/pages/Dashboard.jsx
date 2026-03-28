// Import React hooks
import { useEffect, useState } from "react";

// Import components
import ProgressSummary from "../components/ProgressSummary";
import ErrorMessage from "../components/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";

// Import background image
import heroImage from "../assets/dashboard-bg.png";

// Base URL for backend API through Vite proxy
const API_URL = "/api";

function Dashboard() {
  // State for main data
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for auth form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State for logged in user
  const [currentUser, setCurrentUser] = useState(null);

  // State for auth messages
  const [authMessage, setAuthMessage] = useState("");

  // Load main dashboard data
  function loadDashboardData() {
    setLoading(true);
    setError("");

    Promise.all([
      fetch(`${API_URL}/courses`, {
        credentials: "include",
      }).then((res) => {
        if (!res.ok) throw new Error("Could not load courses");
        return res.json();
      }),

      fetch(`${API_URL}/assignments`, {
        credentials: "include",
      }).then((res) => {
        if (!res.ok) throw new Error("Could not load assignments");
        return res.json();
      }),

      fetch(`${API_URL}/submissions`, {
        credentials: "include",
      }).then((res) => {
        if (!res.ok) throw new Error("Could not load submissions");
        return res.json();
      }),
    ])
      .then(([coursesData, assignmentsData, submissionsData]) => {
        // Courses and assignments come from paginated endpoints
        setCourses(coursesData.items || []);
        setAssignments(assignmentsData.items || []);
        setSubmissions(submissionsData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }

  // Load dashboard data when the component mounts
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Sign up a new user
  function handleSignup() {
    if (!username.trim() || !password.trim()) {
      setAuthMessage("Please enter username and password");
      return;
    }

    fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Signup failed");
        }

        return data;
      })
      .then((data) => {
        // Save logged in user in state
        setCurrentUser(data);
        setAuthMessage(`Signed up and logged in as ${data.username}`);
        setUsername("");
        setPassword("");
        loadDashboardData();
      })
      .catch((err) => {
        console.error(err);
        setAuthMessage(err.message);
      });
  }

  // Log in existing user
  function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setAuthMessage("Please enter username and password");
      return;
    }

    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Login failed");
        }

        return data;
      })
      .then((data) => {
        // Save logged in user in state
        setCurrentUser(data);
        setAuthMessage(`Logged in as ${data.username}`);
        setUsername("");
        setPassword("");
        loadDashboardData();
      })
      .catch((err) => {
        console.error(err);
        setAuthMessage(err.message);
      });
  }

  // Log out current user
  function handleLogout() {
    fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Logout failed");
        }

        return data;
      })
      .then(() => {
        // Clear local user state after logout
        setCurrentUser(null);
        setCourses([]);
        setAssignments([]);
        setSubmissions([]);
        setAuthMessage("Logged out");
      })
      .catch((err) => {
        console.error(err);
        setAuthMessage("Logout failed");
      });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        color: "#222",
      }}
    >
      {/* Main content block */}
      <div
        style={{
          marginTop: "80px",
          textAlign: "center",
        }}
      >
        {/* Page title */}
        <h1
          style={{
            marginBottom: "10px",
            fontSize: "40px",
            fontWeight: "600",
            letterSpacing: "0.5px",
          }}
        >
          Dashboard
        </h1>

        {/* Page subtitle */}
        <p
          style={{
            color: "#2b6cb0",
            fontSize: "20px",
            marginBottom: "24px",
            fontWeight: "500",
          }}
        >
          Track your learning progress
        </p>

        {/* Auth panel */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.94)",
            padding: "20px",
            borderRadius: "14px",
            width: "420px",
            maxWidth: "95%",
            textAlign: "center",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
            margin: "0 auto 20px auto",
          }}
        >
          <h3 style={{ marginBottom: "12px" }}>Account</h3>

          <p style={{ marginBottom: "12px" }}>
            {currentUser
              ? `Logged in as ${currentUser.username}`
              : "You are not logged in"}
          </p>

          <div style={{ marginBottom: "12px" }}>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                padding: "8px",
                marginRight: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <button
              onClick={handleSignup}
              style={{ ...blueBtn, marginRight: "10px" }}
            >
              Sign Up
            </button>

            <button
              onClick={handleLogin}
              style={{ ...blueBtn, marginRight: "10px" }}
            >
              Log In
            </button>

            <button onClick={handleLogout} style={redBtn}>
              Log Out
            </button>
          </div>

          {authMessage && (
            <p
              style={{
                color: "#2b6cb0",
                fontSize: "14px",
                marginTop: "8px",
              }}
            >
              {authMessage}
            </p>
          )}
        </div>

        {/* Dashboard content */}
        {loading ? (
          <LoadingIndicator />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.94)",
              padding: "28px",
              borderRadius: "14px",
              width: "360px",
              textAlign: "center",
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
              margin: "0 auto",
            }}
          >
            <ProgressSummary
              totalCourses={courses.length}
              totalAssignments={assignments.length}
              totalSubmissions={submissions.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const blueBtn = {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#2b6cb0",
  color: "white",
  cursor: "pointer",
};

const redBtn = {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#e53e3e",
  color: "white",
  cursor: "pointer",
};

export default Dashboard;