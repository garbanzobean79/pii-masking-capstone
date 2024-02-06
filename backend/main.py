from typing import Union

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pprint import pprint

from logger import logger
from datetime import datetime

import firebase_admin
from firebase_admin import credentials, firestore

app = FastAPI()
logger.info('Starting Backend API')

# Use a service account.
cred = credentials.Certificate('key.json')
fb_app = firebase_admin.initialize_app(cred)
db = firestore.client()

class User(BaseModel):
    username: str
    password: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/register/")
def register_user(user: User):
    # Determine if the user already exists (unique key)
    docs = (
        db.collection('users')
        .where('username', '==', user.username)
        .stream()
    )

    # User with this username already exists
    if len(list(docs)) > 0:
        raise HTTPException(status_code=409, detail=f'User with username of {user.username} already exists! Try another username.')

    # Register this user
    now = datetime.now()
    print(type(user))
    print(user)

    db.collection('users').document(user.username).set({'timestamp': now, **user.dict()})
    return {'message': 'User successfully created', 'username': user.username, 'timestamp': datetime.now()}

@app.get("/usernames/{username}")
def read_username(username: str):
    logger.info('GET Request to /usernames/{username}')
    # users_ref = db.collection("users")

    # query_ref = users_ref.where(filter=firestore.FieldFilter("username", "==", username))

    # doc = query_ref.get()

    docs = (
        db.collection("users")
        .where(filter=firestore.FieldFilter("username", "==", username))
        .stream()
    )

    for doc in docs:
        print(f"{doc.id} => {doc.to_dict()}")
        return doc.to_dict()