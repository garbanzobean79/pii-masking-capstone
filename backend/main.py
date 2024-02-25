from typing import Union, Annotated

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from jose import JWTError, jwt
from passlib.context import CryptContext

from logger import logger
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
import os

import requests

import firebase_admin
from firebase_admin import credentials, firestore

app = FastAPI()

# Load environment variables from .env file
load_dotenv()

logger.info('Starting Backend API')

# Authentication information
# Authentication scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Token info
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Use a service account.
cred = credentials.Certificate('key.json')
fb_app = firebase_admin.initialize_app(cred)
db = firestore.client()

# Huggingface model
INFERENCE_URL = "https://api-inference.huggingface.co/models/Isotonic/deberta-v3-base_finetuned_ai4privacy_v2"
INFERENCE_HEADER = {"Authorization": f'Bearer {os.getenv("INFERENCE_TOKEN")}'}

class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None
    register_time: datetime | None = None

class RegisteringUser(User):
    password: str

class UserInDB(User):
    hashed_password: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

######
# Calling model
######
async def get_inference(payload):
    response = requests.post(INFERENCE_URL, headers=INFERENCE_HEADER, json=payload)

    res_json = response.json()

    print(res_json)

    if 'error' in res_json and 'estimated_time' in res_json:
        raise HTTPException(
            status_code=503, 
            detail=f"Error from HuggingFace: {response['error']}. Estimated time: {response['estimated_time']}",
            headers={'Retry-After': response['estimated_time']}
        )
    elif 'error' in res_json:
        raise HTTPException(
            status_code=500, 
            detail=f"Error from HuggingFace: {response['error']}."
        )

    return response.json()

# @Dipen: insert your masking code here
@app.post("/masktext")
async def mask_text(text: str):
    return get_inference({"inputs": text})

######
# Store fine-tuning data from user
######
# TODO
@app.post("/submit-model-feedback")
async def submit_model_feedback():
    return "testing"

#######
# User Validation
#######
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


@app.post("/register/")
def register(user: RegisteringUser):

    # Determine if the user already exists (unique key)
    docs = (
        db.collection('users')
        .where(filter=firestore.FieldFilter('username', '==', user.username))
        .stream()
    )

    # User with this username already exists
    if len(list(docs)) > 0:
        raise HTTPException(status_code=409, detail=f'User with username of {user.username} already exists! Try another username.')

    # Register this user
    # Hash password
    db_user = UserInDB(
        **user.dict(),
        register_time = datetime.now(),
        hashed_password = get_password_hash(user.password)
    )

    db.collection('users').document(db_user.username).set(db_user.dict())
    return {'message': 'User successfully created', 'username': user.username, 'register_time': datetime.now()}


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


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(db, username: str):
    # Query db for user
    docs = (
        db.collection('users')
        .where(filter = firestore.FieldFilter("username", "==", username))
        .stream()
    )

    docs_list = list(docs)

    if len(docs_list) == 1:
        for doc in docs_list:
            return UserInDB(**doc.to_dict())


def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@app.get("/users/me")
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    del current_user.hashed_password
    return current_user
