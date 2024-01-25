import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import get_db

# create a blueprint named 'auth'
bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', method=('GET', 'POST')) # associate /register with register view function
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None

        if not username:
            error = 'Username is required.'
        elif not password:
            error = 'Password is required.'

        if error is None:
            try:
                db.execute(
                    "INSERT INTO user (username, password) VALUES (?, ?)",
                    (username, generate_password_hash(password)),
                )
                db.commit() # called to save changes since this query modifies data
            except db.IntegrityError:
                error = f"User {username} is already registered."
            else:
                # no exception raised so redirect to login page
                return redirect(url_for("auth.login"))
        
        # validatation failed
        flash(error) # store error message for retrieval when rendering the template
    
    return render_template('auth/register.html')    # render html template for registration

@bp.route('/login', method=('GET', 'POST'))
def login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None
        user = db.execute(
            'SELECT * FROM user WHERE username = ?', (username,)
        ).fetchone()

        if user is None:
            error = 'Incorrect username.'
        elif not check_password_hash(user['password'], password):
            error = 'Incorrect password.'

        if error is None:
            # session is a dict that stores data across requests and is stored in 
            # a cookie that is sent to the browser and back with subsequent requests
            session.clear()
            session['user_id'] = user['id']
            return redirect(url_for('index'))

        flash(error)

    return render_template('auth/login.html')

@bp.before_app_request      # runs before the view function, no matter what URL is requested
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        # store user data in g.user for the length of the request
        g.user = get_db().execute(
            'SELECT * FROM user WHERE id = ?', (user_id,)
        ).fetchone()

@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

# uses a decorator
# returns a new view function that wraps the original view its applied to
# new function checks if a user is loaded and redirects to the login page otherwise
# if a user is loaded the original view is called and continues normally.
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))
        
        return view(**kwargs)
    
    return wrapped_view