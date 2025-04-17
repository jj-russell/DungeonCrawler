from flask import Flask, render_template, request, session, redirect, url_for, g, request
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

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html", title="Main Menu")

@app.route("/game", methods=["GET", "POST"])
@login_required
def game():
    return render_template("game.html", title="Game")

@app.route("/store_score", methods=["GET", "POST"])
@login_required
def store_score():
    score = int(request.form["score"])
    time = int(request.form["time"])
    
    db = get_db()
    current_score = db.execute("""SELECT score
                                  FROM users
                                  WHERE user = ?""", (g.user,)).fetchone()

    current_time = db.execute("""SELECT time
                                  FROM users
                                  WHERE user = ?""", (g.user,)).fetchone()

    current_score = int(current_score["score"])
    current_time = int(current_time["time"])


    if score > current_score or (score == current_score and time < current_time):
        db.execute("""UPDATE users
                    SET score = ?, time = ?
                    WHERE user = ?""", (score, time, g.user))
        db.commit()
        return "success"
    return "nope"

@app.route("/leaderboard")
def leaderboard():
    db = get_db()
    leaderboard = db.execute("""SELECT * FROM users  
                                ORDER BY score DESC, time ASC;""").fetchall()

    return render_template("leaderboard.html", leaderboard=leaderboard, title="Leaderboard")

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
            db.execute("""INSERT INTO users (user, password, score, time)
                          VALUES (?, ?, '0', '0');""", (user, generate_password_hash(password)))
            db.commit()
            return redirect(url_for("login"))

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
    return render_template("login.html", form=form, title="Login")

@app.route("/logout")
def logout():
    session.clear()
    session.modified = True
    return redirect(url_for("index"))

@app.route("/attribution")
def attribution():
    return render_template("attribution.html", title="attribution")