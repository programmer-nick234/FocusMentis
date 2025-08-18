from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Avg, Sum, Count, Q
from datetime import datetime, timedelta
import uuid

from .models import AudioTrack, TransformedTrack, UserProfile, ProcessingJob
from .serializers import (
    UserSerializer, UserProfileSerializer, AudioTrackSerializer,
    TransformedTrackSerializer, ProcessingJobSerializer, AudioTrackUploadSerializer,
    TransformationRequestSerializer, AudioTrackUpdateSerializer
)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for User model - read-only"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user information"""
        # Return a default user for demo purposes
        default_user = User.objects.first() or User.objects.create_user(
            username='demo_user',
            email='demo@focusmentex.com'
        )
        serializer = self.get_serializer(default_user)
        return Response(serializer.data)


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for UserProfile model"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        """Return only the current user's profile"""
        default_user = User.objects.first() or User.objects.create_user(
            username='demo_user',
            email='demo@focusmentex.com'
        )
        return UserProfile.objects.filter(user=default_user)
    
    def perform_create(self, serializer):
        """Create profile for current user"""
        default_user = User.objects.first() or User.objects.create_user(
            username='demo_user',
            email='demo@focusmentex.com'
        )
        serializer.save(user=default_user)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get user statistics"""
        default_user = User.objects.first() or User.objects.create_user(
            username='demo_user',
            email='demo@focusmentex.com'
        )
        profile, created = UserProfile.objects.get_or_create(user=default_user)
        
        # Calculate recent stats (last 30 days)
        month_ago = timezone.now() - timedelta(days=30)
        recent_tracks = AudioTrack.objects.filter(
            user=default_user,
            created_at__gte=month_ago
        )
        recent_transformations = TransformedTrack.objects.filter(
            original_track__user=default_user,
            created_at__gte=month_ago
        )
        
        stats = {
            'total_tracks_uploaded': profile.total_tracks_uploaded,
            'total_transformations': profile.total_transformations,
            'total_processing_time': profile.total_processing_time,
            'monthly_uploads': recent_tracks.count(),
            'monthly_transformations': recent_transformations.count(),
            'subscription_tier': profile.subscription_tier,
            'preferred_styles': profile.preferred_styles,
        }
        
        return Response(stats)


class AudioTrackViewSet(viewsets.ModelViewSet):
    """ViewSet for AudioTrack model"""
    serializer_class = AudioTrackSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)
    
    def get_queryset(self):
        """Return only the current user's audio tracks"""
        default_user = User.objects.first() or User.objects.create_user(
            username='demo_user',
            email='demo@focusmentex.com'
        )
        return AudioTrack.objects.filter(user=default_user)
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'create':
            return AudioTrackUploadSerializer
        elif self.action in ['update', 'partial_update']:
            return AudioTrackUpdateSerializer
        return AudioTrackSerializer
    
    def perform_create(self, serializer):
        """Create audio track and update user profile"""
        default_user = User.objects.first() or User.objects.create_user(
            username='demo_user',
            email='demo@focusmentex.com'
        )
        track = serializer.save()
        
        # Update user profile
        profile, created = UserProfile.objects.get_or_create(user=default_user)
        profile.total_tracks_uploaded += 1
        profile.monthly_uploads += 1
        profile.save()
    
    @action(detail=True, methods=['post'])
    def transform(self, request, pk=None):
        """Request transformation of an audio track"""
        track = self.get_object()
        
        # Validate transformation request
        serializer = TransformationRequestSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        track_id = serializer.validated_data['track_id']
        styles = serializer.validated_data['styles']
        
        # Verify track ownership
        if track_id != track.id:
            return Response({'error': 'Track ID mismatch'}, status=status.HTTP_400_BAD_REQUEST)
        
        created_transformations = []
        
        for style in styles:
            # Check if transformation already exists
            existing_transformation = TransformedTrack.objects.filter(
                original_track=track,
                style=style
            ).first()
            
            if existing_transformation:
                created_transformations.append(existing_transformation)
                continue
            
            # Create new transformation
            transformation = TransformedTrack.objects.create(
                original_track=track,
                style=style,
                status='pending'
            )
            
            # Create processing job
            job_id = str(uuid.uuid4())
            ProcessingJob.objects.create(
                user=default_user,
                transformed_track=transformation,
                job_id=job_id,
                status='queued'
            )
            
            created_transformations.append(transformation)
        
        # Update user profile
        default_user = User.objects.first() or User.objects.create_user(
            username='demo_user',
            email='demo@focusmentex.com'
        )
        profile, created = UserProfile.objects.get_or_create(user=default_user)
        profile.total_transformations += len(created_transformations)
        profile.monthly_transformations += len(created_transformations)
        profile.save()
        
        serializer = TransformedTrackSerializer(created_transformations, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search for tracks by name or artist"""
        query = request.query_params.get('q', '')
        if not query:
            return Response([])
        
        default_user = User.objects.first() or User.objects.create_user(
            username='demo_user',
            email='demo@focusmentex.com'
        )
        tracks = AudioTrack.objects.filter(
            user=default_user
        ).filter(
            Q(track_name__icontains=query)
        )[:10]
        
        serializer = AudioTrackSerializer(tracks, many=True, context={'request': request})
        return Response(serializer.data)


class TransformedTrackViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for TransformedTrack model - read-only"""
    serializer_class = TransformedTrackSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        """Return only the current user's transformed tracks"""
        default_user = User.objects.first() or User.objects.create_user(
            username='demo_user',
            email='demo@focusmentex.com'
        )
        return TransformedTrack.objects.filter(original_track__user=default_user)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Get download URL for transformed track"""
        transformed_track = self.get_object()
        
        if transformed_track.status != 'completed':
            return Response(
                {'error': 'Transformation not completed yet'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not transformed_track.transformed_file:
            return Response(
                {'error': 'No file available for download'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        download_url = request.build_absolute_uri(transformed_track.transformed_file.url)
        return Response({'download_url': download_url})


class ProcessingJobViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for ProcessingJob model - read-only"""
    serializer_class = ProcessingJobSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        """Return only the current user's processing jobs"""
        default_user = User.objects.first() or User.objects.create_user(
            username='demo_user',
            email='demo@focusmentex.com'
        )
        return ProcessingJob.objects.filter(user=default_user)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active processing jobs"""
        default_user = User.objects.first() or User.objects.create_user(
            username='demo_user',
            email='demo@focusmentex.com'
        )
        active_jobs = ProcessingJob.objects.filter(
            user=default_user,
            status__in=['queued', 'processing']
        )
        
        serializer = ProcessingJobSerializer(active_jobs, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a processing job"""
        job = self.get_object()
        
        if job.status not in ['queued', 'processing']:
            return Response(
                {'error': 'Job cannot be cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        job.status = 'cancelled'
        job.save()
        
        # Update transformed track status
        job.transformed_track.status = 'failed'
        job.transformed_track.error_message = 'Job cancelled by user'
        job.transformed_track.save()
        
        serializer = ProcessingJobSerializer(job, context={'request': request})
        return Response(serializer.data)
