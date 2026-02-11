from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from posts.models import Post


class Command(BaseCommand):
    help = 'Seed the database with sample users and posts'

    def handle(self, *args, **options):
        if User.objects.exists():
            self.stdout.write('Database already seeded.')
            return

        alice = User.objects.create_user(username='alice', email='alice@example.com', password='password123')
        bob = User.objects.create_user(username='bob', email='bob@example.com', password='password123')

        Post.objects.create(title='First Post', content='This is the first post content by Alice.', author=alice)
        Post.objects.create(title='Second Post', content='Bob shares his thoughts in this post.', author=bob)
        Post.objects.create(title='Third Post', content='Alice writes another interesting article.', author=alice)

        self.stdout.write(self.style.SUCCESS('Database seeded with 2 users and 3 posts.'))
