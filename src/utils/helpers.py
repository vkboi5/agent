from jose import JWTError, jwt
from typing import Optional
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from sqlmodel import Session, select
from ..models.voice_model import Voice
from .db import engine
from ..constants.common import JWT_SECRET_KEY
# END IMPORTS

# AUTH SCHEME
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def create_jwt_token(data: dict, expires_delta: Optional[int] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    else:
        expire = datetime.utcnow() + timedelta(days=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm="HS256")
    return encoded_jwt


def decode_jwt_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_jwt_token(token)
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return user_id


def get_voice_id(current_user_id: str):
    with Session(engine) as db:
        statement = select(Voice).where(Voice.user_id == current_user_id)
        results = db.exec(statement).all()
        
        if not results:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Voice not found for this user"
            )
        
        # If multiple records exist, this picks the first one
        voice_instance = results[0]
        return voice_instance.voice_id
