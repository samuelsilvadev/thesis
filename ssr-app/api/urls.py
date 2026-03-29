from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'notes', views.NoteViewSet)

urlpatterns = [
    path('auth/register', views.register_view, name='api_register'),
    path('auth/login', views.login_view, name='api_login'),
    path('auth/me', views.me_view, name='api_me'),
    path('', include(router.urls)),
]
