from django.contrib.auth.models import User
from django.test import Client, TestCase
from django.urls import reverse

from .models import Note


class NoteViewTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username='owner', password='password123')
        self.other_user = User.objects.create_user(username='other', password='password123')
        self.note = Note.objects.create(title='Owner note', content='<script>alert(1)</script>', author=self.owner)

    def test_note_list_escapes_user_content(self):
        response = self.client.get(reverse('note_list'))

        self.assertContains(response, '&lt;script&gt;alert(1)&lt;/script&gt;', html=False)
        self.assertNotContains(response, '<script>alert(1)</script>', html=False)

    def test_only_owner_can_edit_a_note(self):
        self.client.force_login(self.other_user)

        response = self.client.post(
            reverse('note_edit', args=[self.note.pk]),
            {'title': 'Changed', 'content': 'Changed content'},
        )

        self.assertEqual(response.status_code, 403)
        self.note.refresh_from_db()
        self.assertEqual(self.note.title, 'Owner note')

    def test_csrf_token_is_required_for_note_creation(self):
        csrf_client = Client(enforce_csrf_checks=True)
        csrf_client.force_login(self.owner)

        response = csrf_client.post(reverse('note_create'), {'title': 'Blocked', 'content': 'Missing token'})

        self.assertEqual(response.status_code, 403)

    def test_security_headers_are_present(self):
        response = self.client.get(reverse('note_list'))

        self.assertEqual(response.headers['Content-Security-Policy'], "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'")
        self.assertEqual(response.headers['X-Content-Type-Options'], 'nosniff')
        self.assertEqual(response.headers['X-Frame-Options'], 'DENY')
        self.assertEqual(response.headers['Referrer-Policy'], 'strict-origin-when-cross-origin')
