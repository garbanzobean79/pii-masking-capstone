import sqlite3

import click
from flask import current_app, g

# g is a special object unique for each database connection request
# it stores data that might be accessed by multiple functions during the request
# connection is stored and reused instead of creating a new connection if get_db is called a second time in the same request

# current_app is another special object that points to the Flask application handling the request
# since application factory is used in __init__.py, there is no application object when writing the rest of the code
# get_db will be called when the application is created and is handing a request, so current_app can be used

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db

def close_db(e=None):
    # check if g.db was set
    db = g.pop('db', None)

    # if it was, close it
    if db is not None:
        db.close()

def init_db():
    # return db connection
    db = get_db()

    # open file relative to flaskr package and execute sql commands from file
    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


# defines a command line command called init-db that calls the init_db function
# and shows a success message to the user
@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()

    click.echo('Initialized the database.')

def init_app(app):
    # tells Flask to call that function when cleaning up after returning the response
    app.teardown_appcontext(close_db)

    # adds a new command that can be called with the flask command
    app.cli.add_command(init_db_command)