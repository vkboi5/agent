from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm,OAuth2PasswordBearer
from ..utils.helpers import create_jwt_token, get_current_user, decode_jwt_token
from ..models.account import UserBase, User, UserLogin
from sqlmodel import Session, select
from ..utils.db import engine
from ..models.voice_model import Voice
from datetime import datetime, timedelta
# END IMPORTS


user_router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Token endpoint for FastAPI docs authorization
@user_router.post("/token")
def login_for_token(form_data: OAuth2PasswordRequestForm = Depends()):
    print(form_data.password)
    with Session(engine) as db:
        user = db.exec(select(User).where(
            User.email == form_data.username)).first()
        if user and form_data.password == user.password:
            print(user)
            token_data = {"user_id": user.id}
            return {"access_token": create_jwt_token(token_data), "token_type": "bearer"}
        raise HTTPException(status_code=401, detail="Invalid Credentials")

def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        # Decode the token and extract user ID
        payload = decode_jwt_token(token)
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Fetch the full user object from the database
        with Session(engine) as db:
            user = db.exec(select(User).where(User.id == user_id)).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            return user
    
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@user_router.get("/user")
def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email, "name": current_user.first_name + " " + current_user.last_name}

@user_router.post("/login")
def login(user_data: UserLogin):
    print(user_data)
    with Session(engine) as db:
        user = db.exec(select(User).where(
            User.email == user_data.email)).first()
        if user and user_data.password == user.password:
            print(user)
            token_data = {"user_id": user.id}
            return {"access_token": create_jwt_token(token_data), "token_type": "bearer"}
        raise HTTPException(status_code=401, detail="Invalid Credentials")


@user_router.post("/register")
def register(user: UserBase):
    with Session(engine) as db:
        existing_user = db.exec(select(User).where(
            User.email == user.email)).first()
        if existing_user:
            raise HTTPException(
                status_code=400, detail="Email already registered")

        # Create a new user
        new_user = User(
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            username=user.email,
            password=user.password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        # create default voice
        print(new_user.id)
        default_voice = Voice(
            voice_id='21m00Tcm4TlvDq8ikWAM',
            user_id=new_user.id
        )
        db.add(default_voice)
        db.commit()
        db.refresh(new_user)

        return new_user
