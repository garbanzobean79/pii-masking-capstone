from typing import Union, Annotated

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from jose import JWTError, jwt
from passlib.context import CryptContext

from logger import logger
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
import os

import requests

import firebase_admin
from firebase_admin import credentials, firestore, exceptions

from latest import mask

app = FastAPI()

# Allow requests from frontend running on different origin
origins = [
    "http://localhost:5173",
    "localhost:5173/"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Allow requests from frontend running on different origin
origins = [
    "http://localhost:5173",
    "localhost:5173/"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

global session
global current_mask
global current_masklevel
global current_mask_dict

session=mask(1,[])

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
    firstname: str | None = None
    lastname: str | None = None
    fullname: str | None = None
    firstname: str | None = None
    lastname: str | None = None
    fullname: str | None = None
    disabled: bool | None = None
    register_time: datetime | None = None

class RegisteringUser(User):
    password: str

class UserInDB(User):
    hashed_password: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

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
        **user.model_dump(),
        **user.model_dump(),
        hashed_password = get_password_hash(user.password)
    )
    db_user.register_time = datetime.now()
    db_user.register_time = datetime.now()

    db.collection('users').document(db_user.username).set(db_user.model_dump())
    db.collection('users').document(db_user.username).set(db_user.model_dump())
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


######
# Calling model
######
class InferenceEntity(BaseModel):
    entity_group: str
    score: float
    word: str
    start: int
    end: int

class MaskData(BaseModel):
    input: str
    entities: list[InferenceEntity]
    output: str

async def store_mask_history(masking_instance_name: str | None, mask_data: MaskData, mask_mapping: dict, doc_name: str, user: User):
    print("store_mask_history()")

    col_ref = db.collection(f'users/{user.username}/mask_history')
    doc_ref = col_ref.document(doc_name)

    # Create the document
    doc = mask_data.model_dump() | {'created_at': datetime.now()}
    if masking_instance_name is not None:
        doc['masking_instance_name'] = masking_instance_name

    print(f"storing the following doc into masking history for user {user.username}:\n{doc}")
    mask_history_col_ref = db.collection(f'users/{user.username}/mask_history')
    mask_history_doc_ref = mask_history_col_ref.document(doc_name)

    # Create the document
    entities = mask_data.model_dump(include=['entities'])
    masking_data = mask_data.model_dump(exclude=['entities']) # Not including entities

    doc = masking_data | {'created_at': datetime.now()}
    if masking_instance_name is not None:
        doc['masking_instance_name'] = masking_instance_name

    print(f"storing the following doc into masking history for user {user.username}:\n{doc}")

    try:
        res = mask_history_doc_ref.set(doc)

        # set ner entities collection docs
        for i, entity in enumerate(entities['entities']):
            ner_entity_doc_ref = mask_history_doc_ref.collection("ner_entities").document(f"{i}")

            try:
                ner_entity_doc_ref.set(entity | {'masked_to': mask_mapping[entity['word']]})
            except KeyError as e:
                print(f"WARNING => Entity {entity['word']} was not masked!")

    except exceptions.FirebaseError as e:
        print("Error setting document:", e)
        return {'error': 'There was an error in storing this masking instance to your masking history.'}

    return


async def get_inference(payload):
    
    # raise HTTPException(
    #     status_code=503, 
    #     detail={
    #         "message": f"Error from HuggingFace: test message", 
    #         "estimated_time": f"30"
    #     },
    #     headers={'Retry-After': str(30)}
    # )

    response = requests.post(INFERENCE_URL, headers=INFERENCE_HEADER, json=payload)

    res_json = response.json()

    if 'error' in res_json and 'estimated_time' in res_json:
        retry_after_header = res_json['estimated_time']
        print(res_json)
        raise HTTPException(
            status_code=503, 
            detail={
                "message": f"Error from HuggingFace: {res_json['error']}", 
                "estimated_time": f"{res_json['estimated_time']}"
            },
            headers={'Retry-After': str(retry_after_header)}
        )
    elif 'error' in res_json:
        raise HTTPException(
            status_code=500, 
            detail=f"Error from HuggingFace: {res_json['error']}."
        )

    return res_json

class MaskTextParams(BaseModel):
    text: str
    mask_level: list[str]
    masking_instance_name: str | None = None

# mask_level: 
@app.post("/mask-text")
async def mask_text(req_body: MaskTextParams, current_user: Annotated[str, Depends(get_current_active_user)]):
    #new session everytime this endpoint is run
    global session
    
    inference_res = await get_inference({"inputs": req_body.text})

    if(req_body.mask_level==[]):
        session.change_masklevel(1, req_body. mask_level)
    else:
        session=mask(0,req_body.mask_level)
        

    masked_sentence,entity_dic=session.mask_sentence(req_body.text,inference_res) #this will mask the text
    current_mask=masked_sentence
    current_mask_dict=entity_dic
    current_masklevel=req_body.mask_level
    ###
    mask_data = MaskData(
        input = req_body.text,
        entities = [InferenceEntity(**entity_dict) for entity_dict in inference_res],
        output = masked_sentence 
    )
    # Store masking information in db
    #modelresponse=session.get_response()

    #modelreponse is a dictionary with the original and the masked reponse from the gpt model
    doc_name = datetime.now().strftime('%m-%d-%Y %H:%M:%S')
    mask_mapping = {orig_entity: masked_entity for orig_entity, masked_entity in zip(entity_dic['original'], entity_dic['masked'])}
    history_res = await store_mask_history(req_body.masking_instance_name, mask_data, mask_mapping, doc_name, current_user)

    # Return masked text to frontend
    #mask_data contains the mask info
    #session is the global object variable that is used to run the functions inside of the mask class
    #entity_mask is a dictionary with original and masked arrays

    ret = {
        'inference_result': inference_res,
        'masked_input':mask_data,
        'masker':session,
        'entity_mask':entity_dic,
        'masking_instance_id': doc_name
    }

    if history_res is not None:
        ret = ret | history_res


    if 'error' in inference_res:
        raise HTTPException(
            status_code=500, 
            detail=f"Error from HuggingFace: {inference_res['error']}."
        )
    if 'error' in masked_sentence:
        raise HTTPException(
            status_code=501, 
            detail=f"Error from Masking: {masked_sentence['error']}."
        )
    return ret

class ManualMaskingParams(BaseModel):
    word: list[str]
    entity: list[str]
    manual_mask_count: int
    masking_instance_id: str

@app.post("/manual-mask")
async def manual_mask(req_body: ManualMaskingParams, current_user: Annotated[str, Depends(get_current_active_user)]):
    
    original_text, masked_text, tmp_mask_dict = session.manual_mask(req_body.word, req_body.entity)

    mask_dict = {}
    for (original_entity, masked_entity) in zip(tmp_mask_dict['original'], tmp_mask_dict['masked']):
        mask_dict[original_entity] = masked_entity
    
    # Append to mask history
    col_ref = db.collection(f'users/{current_user.username}/mask_history/{req_body.masking_instance_id}/manual_masking_instances')
    manual_masking_inst_doc_ref = col_ref.document(str(req_body.manual_mask_count))

    # Create the document
    mm_doc = {
        "entity_mappings": mask_dict
    }

    print(f"storing into {manual_masking_inst_doc_ref.path}:\n{mm_doc}")

    # TODO: throw a http error instaed of returning an error message
    return_msg = None
    try:
        res = manual_masking_inst_doc_ref.set(mm_doc)

        # Update masked text
        db.document(f'users/{current_user.username}/mask_history/{req_body.masking_instance_id}') \
            .update({"manual_mask_output": masked_text})

    except exceptions.FirebaseError as e:
        print("Error setting document:", e)
        return_msg = {'error': 'There was an error in storing this manual masking instance to your masking history.'}
        # raise HTTPException(500, 'There was an error in storing this manual masking instance to your masking history.')

    return original_text, masked_text, tmp_mask_dict, return_msg

# TODO: change such that only the most recent x documents are retrieved
@app.get("/masking-history")
async def get_mask_history(current_user: Annotated[str, Depends(get_current_active_user)]):

    # Get masking history for this user
    try:
        masking_history_col_ref = db.collection(f'users/{current_user.username}/mask_history')
        query = masking_history_col_ref.order_by('created_at', direction=firestore.Query.DESCENDING).limit(10)
        docs = query.get()

        mask_history_instances = []
        for masking_history_doc in docs:
            doc_data = masking_history_doc.to_dict()
            doc_data['id'] = masking_history_doc.id

            # get entities
            entities_ref = masking_history_doc.reference.collection("ner_entities")
            doc_data['entities'] = []
            for entity_doc in entities_ref.get():
                doc_data['entities'].append(entity_doc.to_dict())

            # get manual masking instances
            mm_ref = masking_history_doc.reference.collection("manual_masking_entities")
            doc_data['manual_masking_entities'] = []
            for entity_doc in mm_ref.get():
                doc_data['manual_masking_entities'].append(entity_doc.to_dict())

            mask_history_instances.append(doc_data)

        return mask_history_instances
    except Exception as e:
        print(f"Error fetching documents: {e}")
        return None

@app.delete("/masking-instance/{id}")
async def delete_masking_instance(id: str, current_user: Annotated[str, Depends(get_current_active_user)]):
    # Get masking instance
    masking_inst_ref = db.document(f'users/{current_user.username}/mask_history/{id}')
    masking_inst_doc = masking_inst_ref.get()

    if not masking_inst_doc.exists:
        raise HTTPException(404, f"No masking instance of {id} found")
    
    masking_inst_ref.delete()

    return {"message": f"Masking instance with ID {id} deleted successfully"}

class ManualMaskingHistoryParams(BaseModel):
    masking_instance_id: str

# @app.get("/manual-masking-history")
# async def get_manual_masking_history(req_body: ManualMaskingHistoryParams, current_user: Annotated[str, Depends(get_current_active_user)]):
#     try:
#         col_ref = db.collection(f'users/{current_user.username}/mask_history/{req_body.masking_instance_id}/')

@app.post("/run-model")
async def model_reponse(current_user: Annotated[str, Depends(get_current_active_user)]): 

    return session.get_response()

######
# Store fine-tuning data from user
######
# TODO
@app.post("/model-feedback")
async def submit_model_feedback(current_user: Annotated[str, Depends(get_current_active_user)]):
    return 