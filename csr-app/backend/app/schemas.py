from datetime import datetime

from pydantic import BaseModel, EmailStr


# --- Auth ---
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Notes ---
class NoteCreate(BaseModel):
    title: str
    content: str


class NoteUpdate(BaseModel):
    title: str
    content: str


class NoteAuthor(BaseModel):
    id: int
    username: str

    model_config = {"from_attributes": True}


class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    author: NoteAuthor
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
