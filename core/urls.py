from django.urls import path
from .views import ping, spotify_login, spotify_callback

urlpatterns = [
    path('ping/', ping),
    path('spotify/login/', spotify_login),
    path('spotify/callback/', spotify_callback),
]
