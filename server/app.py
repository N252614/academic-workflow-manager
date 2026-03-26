# Import Flask and needed tools
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Create Flask app
app = Flask(__name__)

# Enable CORS for React frontend
CORS(app)

# Configure database (SQLite)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize database
db = SQLAlchemy(app)

# Models

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


# Routes - Courses

# Get all courses
@app.route("/courses", methods=["GET"])
def get_courses():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 5, type=int)

    paginated_courses = Course.query.paginate(page=page, per_page=per_page, error_out=False)

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
    data = request.json

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
    course = Course.query.get(id)

    if not course:
        return {"error": "Course not found"}, 404

    data = request.json

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


# Get all assignments
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
    data = request.json

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
    assignment = Assignment.query.get(id)

    if not assignment:
        return {"error": "Assignment not found"}, 404

    data = request.json

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
    data = request.json

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


# Delete submission
@app.route("/submissions/<int:id>", methods=["DELETE"])
def delete_submission(id):
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
    data = request.json

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
