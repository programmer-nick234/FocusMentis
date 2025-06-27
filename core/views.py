import os 
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from django.shortcuts import render
# from rest_framework.decorators import api_view, Response
from django.http import JsonResponse, HttpResponseRedirect
from rest_framework.decorators import api_view
from rest_framework.response import Response



SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")

def spotify_login(request):
    sp_oauth = SpotifyOAuth(client_id=SPOTIFY_CLIENT_ID,
                            client_secret=SPOTIFY_CLIENT_SECRET,
                            redirect_uri=SPOTIFY_REDIRECT_URI,
                            scope=scope)
    auth_url = sp_oauth.get_authorize_url()
    return HttpResponseRedirect(auth_url)

def spotify_callback(request):
    code = request.GET.get("code")
    sp_oauth = SpotifyOAuth(client_id=SPOTIFY_CLIENT_ID,
                            client_secret=SPOTIFY_CLIENT_SECRET,
                            redirect_uri=SPOTIFY_REDIRECT_URI,
                            scope=scope)
    token_info = sp_oauth.get_access_token(code)
    access_token = token_info['access_token']

    sp = spotipy.Spotify(auth=access_token)
    user_info = sp.current_user()
    return JsonResponse(user_info)

scope = "user-read-currently-playing user-read-playback-state"

@api_view(['GET'])
def ping(request):
    return Response({"message": "FocusMentis backend working!"})


# Create your views here.
