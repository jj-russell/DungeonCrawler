from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import InputRequired, EqualTo

class LoginForm(FlaskForm):
    user = StringField("User", validators=[
                    InputRequired(message="* User cannot be blank."),],
                    render_kw={"placeholder": "Username"})

    password = PasswordField(validators=[
                    InputRequired(message="* Password cannot be blank.")],
                    render_kw={"placeholder":"Password"})
    
    submit = SubmitField("Login")

class RegistrationForm(LoginForm):
    user = StringField("User", validators=[
                    InputRequired(message="* User cannot be blank.")], 
                    render_kw={"placeholder": "Username"})

    password = PasswordField(validators=[
                    InputRequired(message="* Password cannot be blank."), 
                    EqualTo('password2', message='* Passwords must match.')],
                    render_kw={"placeholder":"Password"})
    
    password2  = PasswordField(render_kw={"placeholder":"Confirm password"})
    
    submit = SubmitField("Sign Up")
