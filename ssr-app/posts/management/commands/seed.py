from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from posts.models import Note


class Command(BaseCommand):
    help = 'Seed the database with sample users and notes'

    def handle(self, *args, **options):
        if User.objects.exists():
            self.stdout.write('Database already seeded.')
            return

        alice = User.objects.create_user(username='alice', email='alice@example.com', password='password123')
        bob = User.objects.create_user(username='bob', email='bob@example.com', password='password123')

        Note.objects.create(title='Research Notes', content='Alice records her first observations for the thesis.', author=alice)
        Note.objects.create(title='Meeting Summary', content='Bob summarizes the latest project meeting.', author=bob)
        Note.objects.create(title='Security Checklist', content='Alice drafts the next security checks.', author=alice)

        self.stdout.write(self.style.SUCCESS('Database seeded with 2 users and 3 notes.'))
