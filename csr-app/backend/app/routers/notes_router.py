from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user
from ..models import Note, User
from ..schemas import NoteCreate, NoteResponse, NoteUpdate

router = APIRouter(prefix="/api/notes", tags=["notes"])


@router.get("", response_model=list[NoteResponse])
def list_notes(db: Session = Depends(get_db)):
    return db.query(Note).order_by(Note.created_at.desc()).all()


@router.get("/{note_id}", response_model=NoteResponse)
def get_note(note_id: int, db: Session = Depends(get_db)):
    note = db.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return note


@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    data: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = Note(title=data.title, content=data.content, author_id=current_user.id)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    data: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = db.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    if note.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not the note owner")

    note.title = data.title
    note.content = data.content
    db.commit()
    db.refresh(note)
    return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = db.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    if note.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not the note owner")

    db.delete(note)
    db.commit()
