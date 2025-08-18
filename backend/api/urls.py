from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'profiles', views.UserProfileViewSet, basename='profile')
router.register(r'tracks', views.AudioTrackViewSet, basename='track')
router.register(r'transformations', views.TransformedTrackViewSet, basename='transformation')
router.register(r'jobs', views.ProcessingJobViewSet, basename='job')

urlpatterns = [
    path('', include(router.urls)),
]
