from flask import Flask, request
from flask_migrate import Migrate
from config import Config
from models import db, User, Course, Assignment, Submission

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)

    return app

app = create_app()

@app.route("/")
def home():
    return {"message": "Server is running"}

@app.route("/courses", methods=["POST"])
def create_course():
    data = request.get_json()

    new_course = Course(
        title=data.get("title"),
        teacher_id=data.get("teacher_id")  
    )

    db.session.add(new_course)
    db.session.commit()

    return {
        "id": new_course.id,
        "title": new_course.title,
        "teacher_id": new_course.teacher_id
    }, 201

@app.route("/courses", methods=["GET"])
def get_courses():
    courses = Course.query.all()

    result = []
    for course in courses:
        result.append({
            "id": course.id,
            "title": course.title,
            "teacher_id": course.teacher_id   
        })

    return result

@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()

    new_user = User(
        name=data.get("name"),
        role=data.get("role")
    )

    db.session.add(new_user)
    db.session.commit()

    return {
        "id": new_user.id,
        "name": new_user.name,
        "role": new_user.role
    }, 201

@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()

    result = []
    for user in users:
        result.append({
            "id": user.id,
            "name": user.name,
            "role": user.role
        })

    return result

@app.route("/assignments", methods=["POST"])
def create_assignment():
    data = request.get_json()

    new_assignment = Assignment(
        title=data.get("title"),
        course_id=data.get("course_id")
    )

    db.session.add(new_assignment)
    db.session.commit()

    return {
        "id": new_assignment.id,
        "title": new_assignment.title,
        "course_id": new_assignment.course_id
    }, 201

@app.route("/assignments", methods=["GET"])
def get_assignments():
    assignments = Assignment.query.all()

    result = []
    for assignment in assignments:
        result.append({
            "id": assignment.id,
            "title": assignment.title,
            "course_id": assignment.course_id
        })

    return result

@app.route("/submissions", methods=["POST"])
def create_submission():
    data = request.get_json()

    new_submission = Submission(
        status=data.get("status", "pending"),
        assignment_id=data.get("assignment_id"),
        student_id=data.get("student_id")
    )

    db.session.add(new_submission)
    db.session.commit()

    return {
        "id": new_submission.id,
        "status": new_submission.status,
        "assignment_id": new_submission.assignment_id,
        "student_id": new_submission.student_id
    }, 201

@app.route("/submissions", methods=["GET"])
def get_submissions():
    submissions = Submission.query.all()

    result = []
    for sub in submissions:
        result.append({
            "id": sub.id,
            "status": sub.status,
            "assignment_id": sub.assignment_id,
            "student_id": sub.student_id
        })

    return result
