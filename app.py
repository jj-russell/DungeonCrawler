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
            db.execute("""INSERT INTO leaderboard (user, score, time, cheats)
                          VALUES (?, 0, 0, 0)""", (user,))
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

@app.route("/game", methods=["GET", "POST"])
@login_required
def game():
    db = get_db()
    highscore = db.execute("""SELECT score FROM leaderboard
                              WHERE user = ?;""", (g.user,)).fetchone()
    highscore = highscore["score"]

    return render_template("game.html", title="Game", highscore=highscore)

@app.route("/store_score", methods=["GET", "POST"])
@login_required
def store_score():
    score = int(request.form["score"])
    time = int(request.form["time"])
    cheats = int(request.form["cheats"])
    
    db = get_db()
    current_score = db.execute("""SELECT score
                                  FROM leaderboard
                                  WHERE user = ?""", (g.user,)).fetchone()

    current_time = db.execute("""SELECT time
                                  FROM leaderboard
                                  WHERE user = ?""", (g.user,)).fetchone()
    
    current_cheats = db.execute("""SELECT cheats
                                  FROM leaderboard
                                  WHERE user = ?""", (g.user,)).fetchone()

    current_score = int(current_score["score"])
    current_time = int(current_time["time"])
    current_cheats = int(current_cheats["cheats"])


    if score > current_score or (score == current_score and time < current_time) or (current_score == 0 and current_time == 0) or (current_cheats == 1 and cheats == 0):
        db.execute("""UPDATE leaderboard
                    SET score = ?, time = ?, cheats =?
                    WHERE user = ?""", (score, time, cheats, g.user))
        db.commit()
        return "success"
    return "fail"

@app.route("/leaderboard")
def leaderboard():
    db = get_db()
    leaderboard = db.execute("""SELECT * FROM leaderboard  
                                ORDER BY cheats ASC, score DESC, time ASC;""").fetchall()

    return render_template("leaderboard.html", leaderboard=leaderboard, title="Leaderboard")

@app.route("/attribution")
def attribution():
    return render_template("attribution.html", title="attribution")