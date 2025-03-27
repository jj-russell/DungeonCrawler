from flask import Flask, render_template, session, redirect, url_for, g, request
from database import get_db, close_db
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from forms import RegistrationForm, LoginForm
from functools import wraps
from datetime import datetime

app = Flask(__name__)
app.teardown_appcontext(close_db)
app.config["SECRET_KEY"] = "super-secret-key"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.before_request
def load_logged_in_user():
    g.user = session.get("user", None)

def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user is None:
            return redirect(url_for("login", next=request.url))
        return view(*args, **kwargs)
    return wrapped_view

def clear_session():
    for key in list(session.keys()):
        if key not in ['defaults', 'priority_ids']:
            session.pop(key)
    session.modified = True

@app.route("/", methods=["GET", "POST"])
@login_required
def index():
    return render_template("index.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()

    if form.validate_on_submit():
        user = form.user.data
        password = form.password.data

        db = get_db()
        clash = db.execute("""SELECT * 
                              FROM users 
                              WHERE user = ?;""", (user,)).fetchone()

        if clash is not None:
            form.user.errors.append("* User is already taken")

        if not form.user.errors and not form.password.errors:
            db.execute("""INSERT INTO users (user, password)
                          VALUES (?, ?);""", (user, generate_password_hash(password)))
            db.commit()
            return redirect(url_for("index"))

    return render_template("register.html", form=form, title="Register")

@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = form.user.data
        password = form.password.data
        db = get_db()
        user_in_db = db.execute("""SELECT * FROM users
                                   WHERE user = ?;""", (user,)).fetchone()
        if user_in_db is None:
            form.user.errors.append("* user not found.")
        elif not check_password_hash(user_in_db["password"], password):
            form.password.errors.append("* Incorrect password!")
        else:
            session.clear()
            session["user"] = user
            session.modified = True
            next_page = request.args.get("next")
            if not next_page:
                next_page = url_for("index")
            return redirect(next_page)
    return render_template("login.html", form=form)

@app.route("/logout")
def logout():
    session.clear()
    session.modified = True
    return redirect(url_for("index"))