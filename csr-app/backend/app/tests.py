import os
import unittest

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_app.db")

from fastapi.testclient import TestClient

from app.auth import create_access_token
from app.database import Base, SessionLocal, engine
from app.main import app
from app.models import Note, User


class ApiSecurityTests(unittest.TestCase):
    def setUp(self):
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        owner = User(username="owner", email="owner@example.com", password_hash="hash")
        other = User(username="other", email="other@example.com", password_hash="hash")
        db.add_all([owner, other])
        db.flush()
        db.add(Note(title="Owner note", content="Body", author_id=owner.id))
        db.commit()
        db.close()
        self.client = TestClient(app)

    def tearDown(self):
        Base.metadata.drop_all(bind=engine)

    def test_security_headers_are_present(self):
        response = self.client.get("/api/notes")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["x-content-type-options"], "nosniff")
        self.assertEqual(response.headers["x-frame-options"], "DENY")
        self.assertEqual(response.headers["referrer-policy"], "strict-origin-when-cross-origin")
        self.assertIn("default-src 'self'", response.headers["content-security-policy"])

    def test_cors_allows_only_configured_origin(self):
        response = self.client.options(
            "/api/notes",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "GET",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["access-control-allow-origin"], "http://localhost:5173")

    def test_missing_bearer_token_is_rejected(self):
        response = self.client.post("/api/notes", json={"title": "Blocked", "content": "Blocked"})

        self.assertEqual(response.status_code, 403)

    def test_invalid_bearer_token_is_rejected(self):
        response = self.client.post(
            "/api/notes",
            json={"title": "Blocked", "content": "Blocked"},
            headers={"Authorization": "Bearer invalid-token"},
        )

        self.assertEqual(response.status_code, 401)

    def test_non_owner_cannot_update_note(self):
        token = create_access_token(2)

        response = self.client.put(
            "/api/notes/1",
            json={"title": "Changed", "content": "Changed"},
            headers={"Authorization": f"Bearer {token}"},
        )

        self.assertEqual(response.status_code, 403)


if __name__ == "__main__":
    unittest.main()
