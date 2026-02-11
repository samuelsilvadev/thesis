from .auth import hash_password
from .database import Base, SessionLocal, engine
from .models import Post, User


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

    posts = [
        Post(title="First Post", content="This is the first post content by Alice.", author_id=alice.id),
        Post(title="Second Post", content="Bob shares his thoughts in this post.", author_id=bob.id),
        Post(title="Third Post", content="Alice writes another interesting article.", author_id=alice.id),
    ]
    db.add_all(posts)
    db.commit()
    db.close()
    print("Database seeded with 2 users and 3 posts.")


if __name__ == "__main__":
    seed()
