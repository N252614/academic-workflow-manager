# Import Flask and needed tools
from flask import Flask, request, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Create Flask app
app = Flask(__name__)

# Secret key for session-based auth
app.secret_key = "super-secret-key"
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = False

# Configure database (SQLite)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize database
db = SQLAlchemy(app)


# Models

# User model for authentication (stores username and hashed password)
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)


# Course model
class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)


# Assignment model
class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"))


# Submission model
class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignment.id"))
    student_id = db.Column(db.Integer)


# Helper to check if user is logged in
def require_login():
    if "user_id" not in session:
        return {"error": "Unauthorized"}, 401
    return None


# Auth routes

# Signup route
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json or {}

    username = data.get("username")
    password = data.get("password")

    # Check for missing fields
    if not username or not password:
        return {"error": "Username and password are required"}, 400

    # Check if username already exists
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return {"error": "Username already exists"}, 400

    # Create new user with hashed password
    new_user = User(
        username=username,
        password_hash=generate_password_hash(password)
    )

    db.session.add(new_user)
    db.session.commit()

    # Save user in session after signup
    session["user_id"] = new_user.id

    return {
        "id": new_user.id,
        "username": new_user.username
    }, 201


# Login route
@app.route("/login", methods=["POST"])
def login():
    data = request.json or {}

    username = data.get("username")
    password = data.get("password")

    # Check for missing fields
    if not username or not password:
        return {"error": "Username and password are required"}, 400

    # Find user by username
    user = User.query.filter_by(username=username).first()

    # Check username and password
    if not user or not check_password_hash(user.password_hash, password):
        return {"error": "Invalid username or password"}, 401

    # Save user in session
    session["user_id"] = user.id

    return {
        "id": user.id,
        "username": user.username
    }, 200


# Logout route
@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)
    return {"message": "Logged out"}, 200


# Routes - Courses

# Get all courses with pagination
@app.route("/courses", methods=["GET"])
def get_courses():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 5, type=int)

    paginated_courses = Course.query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    result = []
    for course in paginated_courses.items:
        result.append({
            "id": course.id,
            "title": course.title
        })

    return {
        "items": result,
        "page": paginated_courses.page,
        "per_page": paginated_courses.per_page,
        "total": paginated_courses.total,
        "pages": paginated_courses.pages
    }, 200


# Get one course by ID
@app.route("/courses/<int:id>", methods=["GET"])
def get_course(id):
    course = Course.query.get(id)

    if not course:
        return {"error": "Course not found"}, 404

    return {
        "id": course.id,
        "title": course.title
    }, 200


# Create new course
@app.route("/courses", methods=["POST"])
def create_course():
    auth_error = require_login()
    if auth_error:
        return auth_error

    data = request.json or {}

    if not data.get("title"):
        return {"error": "Title is required"}, 400

    new_course = Course(title=data["title"])

    db.session.add(new_course)
    db.session.commit()

    return {
        "id": new_course.id,
        "title": new_course.title
    }, 201


# Update course title
@app.route("/courses/<int:id>", methods=["PATCH"])
def update_course(id):
    auth_error = require_login()
    if auth_error:
        return auth_error

    course = Course.query.get(id)

    if not course:
        return {"error": "Course not found"}, 404

    data = request.json or {}

    if "title" in data and data["title"].strip():
        course.title = data["title"]

    db.session.commit()

    return {
        "id": course.id,
        "title": course.title
    }, 200


# Delete course
@app.route("/courses/<int:id>", methods=["DELETE"])
def delete_course(id):
    auth_error = require_login()
    if auth_error:
        return auth_error

    course = Course.query.get(id)

    if not course:
        return {"error": "Course not found"}, 404

    db.session.delete(course)
    db.session.commit()

    return {"message": "Deleted"}, 200


# Routes - Assignments

# Get assignments for a course
@app.route("/courses/<int:id>/assignments", methods=["GET"])
def get_course_assignments(id):
    assignments = Assignment.query.filter_by(course_id=id).all()

    result = []
    for assignment in assignments:
        result.append({
            "id": assignment.id,
            "title": assignment.title,
            "course_id": assignment.course_id
        })

    return result, 200


# Get all assignments with pagination
@app.route("/assignments", methods=["GET"])
def get_assignments():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 5, type=int)

    paginated_assignments = Assignment.query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    result = []
    for assignment in paginated_assignments.items:
        result.append({
            "id": assignment.id,
            "title": assignment.title,
            "course_id": assignment.course_id
        })

    return {
        "items": result,
        "page": paginated_assignments.page,
        "per_page": paginated_assignments.per_page,
        "total": paginated_assignments.total,
        "pages": paginated_assignments.pages
    }, 200


# Get assignment by ID
@app.route("/assignments/<int:id>", methods=["GET"])
def get_assignment(id):
    assignment = Assignment.query.get(id)

    if not assignment:
        return {"error": "Assignment not found"}, 404

    return {
        "id": assignment.id,
        "title": assignment.title,
        "course_id": assignment.course_id
    }, 200


# Create assignment
@app.route("/assignments", methods=["POST"])
def create_assignment():
    auth_error = require_login()
    if auth_error:
        return auth_error

    data = request.json or {}

    if not data.get("title") or not data.get("course_id"):
        return {"error": "Title and course_id are required"}, 400

    new_assignment = Assignment(
        title=data["title"],
        course_id=data["course_id"]
    )

    db.session.add(new_assignment)
    db.session.commit()

    return {
        "id": new_assignment.id,
        "title": new_assignment.title,
        "course_id": new_assignment.course_id
    }, 201


# Update assignment title
@app.route("/assignments/<int:id>", methods=["PATCH"])
def update_assignment(id):
    auth_error = require_login()
    if auth_error:
        return auth_error

    assignment = Assignment.query.get(id)

    if not assignment:
        return {"error": "Assignment not found"}, 404

    data = request.json or {}

    if "title" in data and data["title"].strip():
        assignment.title = data["title"]

    db.session.commit()

    return {
        "id": assignment.id,
        "title": assignment.title,
        "course_id": assignment.course_id
    }, 200


# Delete assignment
@app.route("/assignments/<int:id>", methods=["DELETE"])
def delete_assignment(id):
    auth_error = require_login()
    if auth_error:
        return auth_error

    assignment = Assignment.query.get(id)

    if not assignment:
        return {"error": "Assignment not found"}, 404

    db.session.delete(assignment)
    db.session.commit()

    return {"message": "Deleted"}, 200


# Routes - Submissions

# Create submission
@app.route("/submissions", methods=["POST"])
def create_submission():
    auth_error = require_login()
    if auth_error:
        return auth_error

    data = request.json or {}

    if not data.get("status") or not data.get("assignment_id") or not data.get("student_id"):
        return {"error": "status, assignment_id, and student_id are required"}, 400

    new_submission = Submission(
        status=data["status"],
        assignment_id=data["assignment_id"],
        student_id=data["student_id"]
    )

    db.session.add(new_submission)
    db.session.commit()

    return {
        "id": new_submission.id,
        "status": new_submission.status,
        "assignment_id": new_submission.assignment_id,
        "student_id": new_submission.student_id
    }, 201


# Get all submissions
@app.route("/submissions", methods=["GET"])
def get_submissions():
    submissions = Submission.query.all()

    result = []
    for submission in submissions:
        result.append({
            "id": submission.id,
            "status": submission.status,
            "assignment_id": submission.assignment_id,
            "student_id": submission.student_id
        })

    return result, 200


# Update submission status
@app.route("/submissions/<int:id>", methods=["PATCH"])
def update_submission(id):
    auth_error = require_login()
    if auth_error:
        return auth_error

    data = request.get_json() or {}

    submission = Submission.query.get(id)
    if not submission:
        return {"error": "Submission not found"}, 404

    submission.status = data.get("status", submission.status)

    db.session.commit()

    return {
        "id": submission.id,
        "status": submission.status,
        "student_id": submission.student_id
    }, 200


# Delete submission
@app.route("/submissions/<int:id>", methods=["DELETE"])
def delete_submission(id):
    auth_error = require_login()
    if auth_error:
        return auth_error

    submission = Submission.query.get(id)

    if not submission:
        return {"error": "Submission not found"}, 404

    db.session.delete(submission)
    db.session.commit()

    return {"message": "Deleted"}, 200


# Routes - AI

# Generate AI study suggestion
@app.route("/ai/suggestion", methods=["POST"])
def get_ai_suggestion():
    data = request.json or {}

    assignment_title = data.get("assignment_title", "").strip()
    submission_count = data.get("submission_count", 0)

    # Build a simple AI-style recommendation
    if not assignment_title:
        suggestion = "Please provide an assignment title to generate a suggestion."
    elif submission_count == 0:
        suggestion = (
            f"No submissions yet for '{assignment_title}'. "
            "Consider reminding students about the deadline and expected requirements."
        )
    elif submission_count < 3:
        suggestion = (
            f"'{assignment_title}' has some activity, but engagement is still low. "
            "You may want to post a short clarification or example response."
        )
    else:
        suggestion = (
            f"'{assignment_title}' already has strong student participation. "
            "This is a good time to review submissions and provide feedback."
        )

    return {"suggestion": suggestion}, 200


# Run app
if __name__ == "__main__":
    app.run(debug=True)
