from .auth import hash_password
from .database import Base, SessionLocal, engine
from .models import Note, User


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(User).first():
        print("Database already seeded.")
        db.close()
        return

    alice = User(username="alice", email="alice@example.com", password_hash=hash_password("password123"))
    bob = User(username="bob", email="bob@example.com", password_hash=hash_password("password123"))
    db.add_all([alice, bob])
    db.flush()

    notes = [
        Note(title="Research Notes", content="Alice records her first observations for the thesis.", author_id=alice.id),
        Note(title="Meeting Summary", content="Bob summarizes the latest project meeting.", author_id=bob.id),
        Note(title="Security Checklist", content="Alice drafts a small checklist for the next tests.", author_id=alice.id),
    ]
    db.add_all(notes)
    db.commit()
    db.close()
    print("Database seeded with 2 users and 3 notes.")


if __name__ == "__main__":
    seed()
