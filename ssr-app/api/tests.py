from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from posts.models import Note


class NoteApiTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username='owner', email='owner@example.com', password='password123')
        self.other_user = User.objects.create_user(username='other', email='other@example.com', password='password123')
        self.note = Note.objects.create(title='API note', content='Original content', author=self.owner)

    def test_authenticated_user_can_create_note(self):
        client = APIClient()
        client.force_authenticate(user=self.owner)

        response = client.post('/api/notes/', {'title': 'Created note', 'content': 'Created via API'}, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['author']['username'], 'owner')

    def test_non_owner_cannot_update_note(self):
        client = APIClient()
        client.force_authenticate(user=self.other_user)

        response = client.patch(f'/api/notes/{self.note.pk}/', {'title': 'Hacked', 'content': 'Nope'}, format='json')

        self.assertEqual(response.status_code, 403)
